import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  route: string;
  external?: boolean;
  icon?: string;
  alwaysVisible?: boolean;
}

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
})
export class ShellLayoutComponent implements OnInit, OnDestroy {
  private routerSubscription?: Subscription;

  @Input() isLeftPaneVisible = false;
  @Input() isRightPaneVisible = false;

  @Input() leftPaneWidth = 250;
  @Input() rightPaneWidth = 250;

  @Input() appVersion = '0.0.1';

  @Output() leftPaneWidthChange = new EventEmitter<number>();
  @Output() rightPaneWidthChange = new EventEmitter<number>();

  @Output() isLeftPaneVisibleChange = new EventEmitter<boolean>();
  @Output() isRightPaneVisibleChange = new EventEmitter<boolean>();

  navOpen = false;
  toolsOpen = false;

  private isResizingLeft = false;
  private isResizingRight = false;

  navItems: NavItem[] = [
    { label: 'Help', route: '/help', icon: 'help', alwaysVisible: true },
    { label: 'Display', route: '/display', icon: 'desktop_windows', alwaysVisible: true },
    { label: 'Configure', route: '/config', icon: 'settings', alwaysVisible: true },
    { label: 'GitHub', route: 'https://github.com', external: true, icon: 'code' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.navOpen = false;
        this.toolsOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  toggleNavMenu(): void {
    this.navOpen = !this.navOpen;
    if (this.navOpen) {
      this.toolsOpen = false;
    }
  }

  toggleToolsMenu(): void {
    this.toolsOpen = !this.toolsOpen;
    if (this.toolsOpen) {
      this.navOpen = false;
    }
  }

  toggleLeftPane(): void {
    this.isLeftPaneVisible = !this.isLeftPaneVisible;
    this.isLeftPaneVisibleChange.emit(this.isLeftPaneVisible);
  }

  toggleRightPane(): void {
    this.isRightPaneVisible = !this.isRightPaneVisible;
    this.isRightPaneVisibleChange.emit(this.isRightPaneVisible);
  }

  onNavItemClick(item: NavItem): void {
    if (item.external) {
      window.open(item.route, '_blank');
    } else {
      this.router.navigateByUrl(item.route);
    }

    this.navOpen = false;
    this.toolsOpen = false;
  }

  onMouseDownLeft(event: MouseEvent): void {
    this.isResizingLeft = true;
    event.preventDefault();
  }

  onMouseDownRight(event: MouseEvent): void {
    this.isResizingRight = true;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isResizingLeft) {
      const minWidth = 180;
      const maxWidth = window.innerWidth - (this.isRightPaneVisible ? this.rightPaneWidth : 0) - 240;
      this.leftPaneWidth = Math.max(minWidth, Math.min(event.clientX, maxWidth));
      this.leftPaneWidthChange.emit(this.leftPaneWidth);
      event.preventDefault();
      return;
    }

    if (this.isResizingRight) {
      const minWidth = 180;
      const maxWidth = window.innerWidth - (this.isLeftPaneVisible ? this.leftPaneWidth : 0) - 240;
      const newWidth = window.innerWidth - event.clientX;
      this.rightPaneWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      this.rightPaneWidthChange.emit(this.rightPaneWidth);
      event.preventDefault();
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isResizingLeft = false;
    this.isResizingRight = false;
  }
}
