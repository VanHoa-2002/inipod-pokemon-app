import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.router.navigate(['/auth/login']);
    this.toastr.success('Logout successfully', 'Success');
  }
}
