import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  private toastr = inject(ToastrService);

  /**
   * Recovery password
   * @returns - The message if success, error if failed
   */
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
