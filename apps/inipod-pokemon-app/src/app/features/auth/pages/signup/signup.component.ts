import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../core/store/auth/auth.action';

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

  private store = inject(Store);

  /**
   * Signup a new user
   * @returns - The user object
   */
  onSignup() {
    this.store.dispatch(
      AuthActions.signup({
        email: this.email,
        password: this.password,
        username: this.username,
      })
    );
  }
}
