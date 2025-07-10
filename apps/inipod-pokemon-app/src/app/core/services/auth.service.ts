import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  /**
   * Login a user
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns - The user object
   */
  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string; userId: string; username: string }>(
        '/api/auth/login',
        {
          email,
          password,
        }
      )
      .pipe(
        tap((res) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', res.accessToken);
          }
        })
      );
  }

  /**
   * Signup a new user
   * @param username - The username of the user
   * @param password - The password of the user
   * @param email - The email of the user
   * @returns - The user object
   */
  signup(username: string, password: string, email: string) {
    return this.http.post('/api/auth/signup', {
      username,
      password,
      email,
    });
  }

  /**
   * Recovery password
   * @param email - The email of the user
   * @returns - The message
   */
  recoveryPassword(email: string) {
    return this.http.post<{ message: string }>('/api/auth/recovery-password', {
      email,
    });
  }

  /**
   * Logout a user
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  /**
   * Get the token of the user
   * @returns - The token of the user
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Check if the user is logged in
   * @returns - True if the user is logged in, false otherwise
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
