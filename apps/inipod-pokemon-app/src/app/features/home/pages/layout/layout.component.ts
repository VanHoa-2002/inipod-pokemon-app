import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class LayoutComponent {
  username = localStorage.getItem('username') || 'User';
  currentYear = new Date().getFullYear();

  private router = inject(Router);

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/auth/login']);
  }
}
