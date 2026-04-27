# DexVis Shell

[![npm](https://img.shields.io/npm/v/@dexvis/shell.svg)](https://www.npmjs.com/package/@dexvis/shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Reusable Angular shell layout — header, resizable side panels, central area, and footer slots. Includes a theme service and toggle button for light/dark mode.

[Live demo](https://dexvis.github.io/app-shell-ng/) · [Source](https://github.com/dexvis/app-shell-ng)

## Install

```bash
npm install @dexvis/shell @angular/material @angular/cdk
```

Requires Angular 21+.

## Setup

In your `styles.scss`:

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (theme-type: color-scheme, primary: mat.$azure-palette),
    typography: Roboto,
  ));
}
```

`theme-type: color-scheme` is required for dark mode to work.

## Usage

```ts
import { ShellLayoutComponent, ThemeToggleComponent } from '@dexvis/shell';
```

```html
<app-shell-layout>
  <button logo mat-icon-button><mat-icon>apps</mat-icon></button>

  <nav header>
    <button mat-button>Help</button>
    <button mat-button>Settings</button>
  </nav>

  <lib-theme-toggle header-right />

  <aside left-pane>Side content</aside>
  <main central-pane>Main content</main>
  <aside right-pane>Inspector</aside>

  <span footer-left>Status</span>
  <span footer-right>v1.0</span>
</app-shell-layout>
```

## API

### `<app-shell-layout>`

Two-way bindable inputs (all optional):

| Input | Type | Default |
|-------|------|---------|
| `leftPaneVisible` / `rightPaneVisible` | `boolean` | `false` |
| `leftPaneWidth` / `rightPaneWidth` | `number` (px) | `250` |

Slots: `logo`, `header`, `header-right`, `mobile-header`, `left-pane`, `left-pane-header`, `central-pane`, `right-pane`, `right-pane-header`, `footer-left`, `footer-center`, `footer-right`.

Public methods (via `#shell="shellLayout"`): `toggleLeftPane()`, `toggleRightPane()`.

### `<lib-theme-toggle>`

Drop-in button that switches the color scheme. Use `mode="cycle"` to cycle through light → dark → auto.

### `ThemeService`

Inject and use signals: `mode()`, `isDark()`. Methods: `setMode()`, `toggle()`, `cycle()`.

### `provideShellTheme(config)`

Optional configuration in `bootstrapApplication`:

```ts
provideShellTheme({ storageKey: 'my-app-theme', defaultMode: 'auto' });
```

## Customization

Override CSS custom properties to adjust dimensions:

```scss
app-shell-layout {
  --shell-toolbar-height: 72px;
  --shell-divider-width: 8px;
}
```

## License

MIT
