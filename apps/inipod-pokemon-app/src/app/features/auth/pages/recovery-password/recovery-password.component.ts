import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-recovery-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recovery-password.component.html',
})
export class RecoveryPasswordComponent {
  email = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onRecoveryPassword() {
    this.auth.recoveryPassword(this.email).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (err) => alert(err.error?.error || 'Recovery password failed'),
    });
  }
}
