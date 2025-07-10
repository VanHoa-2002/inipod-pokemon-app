import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
})
export class LayoutComponent {
  username = localStorage.getItem('username') || 'User';
  currentYear = new Date().getFullYear();
  isOpen = false;
  private router = inject(Router);
  private toastr = inject(ToastrService);
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.router.navigate(['/auth/login']);
    this.toastr.success('Logout successfully', 'Success');
  }
}
