import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from './theme.service';

/**
 * Ready-to-use theme toggle button.
 *
 * Drop it into any slot — typically the shell layout's `[header-right]` slot.
 *
 * @example
 * ```html
 * <app-shell-layout>
 *   <lib-theme-toggle header-right />
 * </app-shell-layout>
 * ```
 *
 * Behavior is controlled by the `mode` input:
 * - `'toggle'` — single click switches between light and dark (default)
 * - `'cycle'`  — click cycles through light → dark → auto
 */
@Component({
  selector: 'lib-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      type="button"
      (click)="onClick()"
      [attr.aria-label]="ariaLabel()"
      [matTooltip]="ariaLabel()"
    >
      <mat-icon>{{ iconName() }}</mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  /** Click behavior — toggle (light↔dark) or cycle (light→dark→auto). */
  readonly mode = input<'toggle' | 'cycle'>('toggle');

  private readonly theme = inject(ThemeService);

  protected readonly iconName = computed(() => {
    const m = this.theme.mode();
    if (m === 'auto') return 'brightness_auto';
    return this.theme.isDark() ? 'dark_mode' : 'light_mode';
  });

  protected readonly ariaLabel = computed(() => {
    const m = this.theme.mode();
    if (m === 'auto') return 'Theme: auto (system)';
    return this.theme.isDark() ? 'Theme: dark' : 'Theme: light';
  });

  protected onClick(): void {
    if (this.mode() === 'cycle') {
      this.theme.cycle();
    } else {
      this.theme.toggle();
    }
  }
}
