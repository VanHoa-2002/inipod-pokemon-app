import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.action';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthEffects {
  private actions$: Actions = inject(Actions);
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(({ email, password, username }) =>
        this.authService.signup(email, password, username).pipe(
          map((res) =>
            AuthActions.signupSuccess({
              token: res.accessToken,
              user: {
                userId: res.userId,
                email: res.email,
                username: res.username,
              },
            })
          ),
          tap(() => this.toastr.success('Signup successfully', 'Success')),
          catchError((err) =>
            of(
              AuthActions.signupFailure({
                error: err.error?.message || 'Signup failed',
              })
            )
          )
        )
      )
    )
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  signupFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupFailure),
        tap(({ error }) => this.toastr.error(error, 'Signup Failed'))
      ),
    { dispatch: false }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((res) => {
            return AuthActions.loginSuccess({
              token: res.accessToken,
              user: {
                userId: res.userId,
                email: res.email,
                username: res.username,
              },
            });
          }),
          tap(() => this.toastr.success('Login successfully', 'Success')),
          catchError((err) =>
            of(
              AuthActions.loginFailure({
                error: err.error.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => this.toastr.error(error, 'Error'))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.router.navigate(['/auth/login']);
          this.toastr.success('Logout successfully', 'Success');
        })
      ),
    { dispatch: false }
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      map(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (token && user) {
          return AuthActions.loginSuccess({ token, user });
        } else {
          return AuthActions.logout();
        }
      })
    )
  );

  recoverPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.recoverPassword),
      mergeMap(({ email }) =>
        this.authService.recoveryPassword(email).pipe(
          map((res) =>
            AuthActions.recoverPasswordSuccess({ message: res.message })
          ),
          catchError((err) =>
            of(
              AuthActions.recoverPasswordFailure({
                error: err.error.message || 'Recovery failed',
              })
            )
          )
        )
      )
    )
  );

  recoverPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.recoverPasswordSuccess),
        tap(({ message }) =>
          this.toastr.success(message, 'Recovery Email Sent')
        )
      ),
    { dispatch: false }
  );

  recoverPasswordFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.recoverPasswordFailure),
        tap(({ error }) => this.toastr.error(error, 'Error'))
      ),
    { dispatch: false }
  );
}
