import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { SHELL_THEME_CONFIG, ShellThemeConfig } from './theme.service';

/**
 * Provides theme configuration for the shell library.
 *
 * Use in `bootstrapApplication`:
 *
 * @example
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [
 *     provideShellTheme({
 *       storageKey: 'my-app-theme',
 *       defaultMode: 'auto',
 *     }),
 *   ],
 * });
 * ```
 *
 * If you don't call this, `ThemeService` still works with sane defaults
 * (no persistence, default mode `auto`).
 */
export function provideShellTheme(
  config: ShellThemeConfig = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SHELL_THEME_CONFIG, useValue: config },
  ]);
}
