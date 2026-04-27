import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  signal,
} from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  exportAs: 'shellLayout',
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class ShellLayoutComponent {
  // ===== Public API — also reachable via #shell="shellLayout" =====

  /** Visibility of the left pane. Two-way bindable: [(leftPaneVisible)] */
  readonly leftPaneVisible = model<boolean>(false);

  /** Visibility of the right pane. Two-way bindable: [(rightPaneVisible)] */
  readonly rightPaneVisible = model<boolean>(false);

  /** Width of the left pane in pixels. Two-way bindable: [(leftPaneWidth)] */
  readonly leftPaneWidth = model<number>(250);

  /** Width of the right pane in pixels. Two-way bindable: [(rightPaneWidth)] */
  readonly rightPaneWidth = model<number>(250);

  /** Toggle left pane visibility. */
  toggleLeftPane(): void {
    this.leftPaneVisible.update((v) => !v);
  }

  /** Toggle right pane visibility. */
  toggleRightPane(): void {
    this.rightPaneVisible.update((v) => !v);
  }

  // ===== Internal state =====

  protected readonly toolsOpen = signal(false);

  private readonly minPaneWidth = 180;
  private readonly centralMinWidth = 240;
  private activeResize: 'left' | 'right' | null = null;
  private detachListeners: (() => void) | null = null;

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => this.detachListeners?.());
  }

  // ===== Mobile menu =====

  protected toggleToolsMenu(): void {
    this.toolsOpen.update((v) => !v);
  }

  // ===== Resize =====

  protected onMouseDownLeft(event: MouseEvent): void {
    this.startResize('left', event);
  }

  protected onMouseDownRight(event: MouseEvent): void {
    this.startResize('right', event);
  }

  private startResize(side: 'left' | 'right', event: MouseEvent): void {
    event.preventDefault();
    this.activeResize = side;

    const onMove = (e: MouseEvent) => this.handleResize(e);
    const onUp = () => this.stopResize();

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    this.detachListeners = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      this.detachListeners = null;
    };
  }

  private handleResize(event: MouseEvent): void {
    event.preventDefault();

    if (this.activeResize === 'left') {
      const otherPane = this.rightPaneVisible() ? this.rightPaneWidth() : 0;
      const max = window.innerWidth - otherPane - this.centralMinWidth;
      const next = Math.max(this.minPaneWidth, Math.min(event.clientX, max));
      this.leftPaneWidth.set(next);
      return;
    }

    if (this.activeResize === 'right') {
      const otherPane = this.leftPaneVisible() ? this.leftPaneWidth() : 0;
      const max = window.innerWidth - otherPane - this.centralMinWidth;
      const proposed = window.innerWidth - event.clientX;
      const next = Math.max(this.minPaneWidth, Math.min(proposed, max));
      this.rightPaneWidth.set(next);
    }
  }

  private stopResize(): void {
    this.activeResize = null;
    this.detachListeners?.();
  }
}
