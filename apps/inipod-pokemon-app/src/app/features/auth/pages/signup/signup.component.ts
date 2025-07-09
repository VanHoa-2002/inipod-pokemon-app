import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  username = '';
  password = '';
  confirmPassword = '';
  email = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  onSignup() {
    this.auth.signup(this.username, this.password, this.email).subscribe({
      next: () => {
        this.toastr.success('Signup successfully!', 'Success');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toastr.error(err.error?.error || 'Signup failed', 'Error');
      },
    });
  }
}
