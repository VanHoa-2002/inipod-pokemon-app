import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  onRecoveryPassword() {
    this.auth.recoveryPassword(this.email).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(
          err.error?.message || 'Recovery failed. Please try again.'
        );
      },
    });
  }
}
