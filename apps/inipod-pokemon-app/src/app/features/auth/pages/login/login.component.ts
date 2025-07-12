import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../core/store/auth/auth.action';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  private store = inject(Store);
  /**
   * Login a user
   * @returns - The user object
   */
  onLogin() {
    this.store.dispatch(
      AuthActions.login({ email: this.email, password: this.password })
    );
  }
}
