import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('username', res.username);
        localStorage.setItem('token', res.accessToken);
        this.toastr.success('Login successfully', 'Success');
        this.router.navigate(['/pokemon']);
      },
      error: (err) => {
        this.toastr.error(err.error?.error || 'Login failed', 'Error');
      },
    });
  }
}
