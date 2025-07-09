import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

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

  signup(username: string, password: string, email: string) {
    return this.http.post('/api/auth/signup', {
      username,
      password,
      email,
    });
  }

  recoveryPassword(email: string) {
    return this.http.post<{ message: string }>('/api/auth/recovery-password', {
      email,
    });
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
