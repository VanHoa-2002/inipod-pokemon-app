import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

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

  private auth = inject(AuthService);
  private router = inject(Router);

  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('Password not match!');
      return;
    }

    this.auth.signup(this.username, this.password).subscribe({
      next: () => {
        alert('Signup success!');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert(err.error?.error || 'Signup failed');
      },
    });
  }
}
