import {
  Injectable,
  InjectionToken,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ThemeMode } from './theme.types';

/**
 * Optional configuration for ThemeService.
 *
 * Provide via `provideShellTheme(...)` in your app's `bootstrapApplication`.
 *
 * @example
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideShellTheme({ storageKey: 'my-app-theme', defaultMode: 'auto' })],
 * });
 * ```
 */
export interface ShellThemeConfig {
  /**
   * If set, the chosen theme mode is persisted to localStorage under this key
   * and restored on next load. If omitted, no persistence (no storage side effects).
   */
  storageKey?: string;

  /**
   * Initial theme mode if nothing is stored. Defaults to `'auto'`.
   */
  defaultMode?: ThemeMode;
}

export const SHELL_THEME_CONFIG = new InjectionToken<ShellThemeConfig>(
  'SHELL_THEME_CONFIG',
  { providedIn: 'root', factory: () => ({}) },
);

/**
 * Manages the application color scheme.
 *
 * Sets the `color-scheme` CSS property on the document root element so that
 * Material 3 design tokens (which are emitted via the CSS `light-dark()` function)
 * automatically resolve to the correct value.
 *
 * - `light` → `color-scheme: light`
 * - `dark`  → `color-scheme: dark`
 * - `auto`  → `color-scheme: light dark` (follows user OS preference)
 *
 * Also sets a `data-theme` attribute on `<html>` for non-Material custom CSS that
 * needs to react to the chosen mode.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly config = inject(SHELL_THEME_CONFIG);

  /** Internal writable signal of the chosen mode. */
  private readonly _mode = signal<ThemeMode>(
    this.readInitialMode(this.config.defaultMode ?? 'auto'),
  );

  /** Currently selected mode. Read-only signal. */
  readonly mode = this._mode.asReadonly();

  /**
   * Effective dark-mode flag. Resolves `auto` against the system preference.
   * Useful for icon switching in UI.
   */
  readonly isDark = computed(() => {
    const m = this._mode();
    if (m === 'dark') return true;
    if (m === 'light') return false;
    // auto — follow system
    if (!this.isBrowser) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  constructor() {
    // Apply mode to <html> whenever it changes.
    effect(() => {
      const m = this._mode();
      this.applyToDocument(m);
      this.persist(m);
    });

    // Track system preference changes when in 'auto' mode so isDark() updates.
    if (this.isBrowser) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        // Re-trigger the signal to recompute isDark when system changes
        if (this._mode() === 'auto') this._mode.set('auto');
      };
      media.addEventListener('change', handler);
    }
  }

  /** Set theme mode explicitly. */
  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
  }

  /**
   * Toggle between light and dark.
   * If currently `auto`, picks the opposite of the resolved system preference.
   */
  toggle(): void {
    this._mode.set(this.isDark() ? 'light' : 'dark');
  }

  /** Cycle through modes: light → dark → auto → light. */
  cycle(): void {
    const next: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'auto',
      auto: 'light',
    };
    this._mode.set(next[this._mode()]);
  }

  // ===== Private =====

  private applyToDocument(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    const html = document.documentElement;
    html.style.colorScheme =
      mode === 'auto' ? 'light dark' : mode;
    html.setAttribute('data-theme', mode);
  }

  private persist(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    const key = this.config.storageKey;
    if (!key) return;
    try {
      localStorage.setItem(key, mode);
    } catch {
      // Storage may be unavailable (private mode, quota, disabled) — ignore.
    }
  }

  private readInitialMode(fallback: ThemeMode): ThemeMode {
    if (!this.isBrowser) return fallback;
    const key = this.config.storageKey;
    if (!key) return fallback;
    try {
      const stored = localStorage.getItem(key);
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored;
      }
    } catch {
      // ignore
    }
    return fallback;
  }
}
