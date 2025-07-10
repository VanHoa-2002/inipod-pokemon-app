import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (typeof window === 'undefined') return next.handle(req);

    const token = localStorage.getItem('token');
    const isAuth =
      req.url.includes('/auth/login') || req.url.includes('/auth/signup');

    if (!token || isAuth) return next.handle(req);

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.toastr.error('Login expired, please login again');
          this.router.navigate(['auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
