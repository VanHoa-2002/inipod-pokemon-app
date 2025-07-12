import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../core/store/auth/auth.action';

@Component({
  standalone: true,
  selector: 'app-recovery-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recovery-password.component.html',
})
export class RecoveryPasswordComponent {
  email = '';
  private store = inject(Store);

  /**
   * Recovery password
   * @returns - The message if success, error if failed
   */
  onRecoveryPassword() {
    this.store.dispatch(AuthActions.recoverPassword({ email: this.email }));
  }
}
