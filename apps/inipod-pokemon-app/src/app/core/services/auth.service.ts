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
      .post<{
        accessToken: string;
        userId: string;
        username: string;
        email: string;
      }>('/api/auth/login', {
        email,
        password,
      })
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
  signup(email: string, password: string, username: string) {
    return this.http.post<{
      accessToken: string;
      userId: string;
      username: string;
      email: string;
    }>('/api/auth/register', {
      email,
      password,
      username,
    });
  }

  /**
   * Recovery password
   * @param email - The email of the user
   * @returns - The message
   */
  recoveryPassword(email: string) {
    return this.http.post<{ message: string }>('/api/auth/recovery', {
      email,
    });
  }
}
