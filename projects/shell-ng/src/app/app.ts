import { Component, signal } from '@angular/core';
import { ShellLayoutComponent, ThemeToggleComponent } from '@dexvis/shell';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ShellLayoutComponent, ThemeToggleComponent, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  leftOpen = signal(true);
  rightOpen = signal(true);
  leftWidth = signal(280);
  rightWidth = signal(320);
}
