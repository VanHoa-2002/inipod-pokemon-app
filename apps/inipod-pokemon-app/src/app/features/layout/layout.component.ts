import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as AuthActions from '../../core/store/auth/auth.action';
import { selectUser } from '../../core/store/auth/auth.selector';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
})
export class LayoutComponent {
  private store = inject(Store);
  username$ = this.store
    .select(selectUser)
    .pipe(map((user) => user?.username || 'User'));
  currentYear = new Date().getFullYear();
  isOpen = false;
  menuItems = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Pokemon List', path: '/pokemon' },
    { label: 'Documentary', path: '/documentary' },
    { label: 'Privacy Policy', path: '/policy' },
  ];

  /**
   * Logout
   */
  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
