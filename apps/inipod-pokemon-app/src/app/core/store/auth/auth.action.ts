import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ email: string; password: string; username: string }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{
    token: string;
    user: { userId: string; email: string; username: string };
  }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: string }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    token: string;
    user: { userId: string; email: string; username: string };
  }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const recoverPassword = createAction(
  '[Auth] Recover Password',
  props<{ email: string }>()
);

export const recoverPasswordSuccess = createAction(
  '[Auth] Recover Password Success',
  props<{ message: string }>()
);

export const recoverPasswordFailure = createAction(
  '[Auth] Recover Password Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const restoreSession = createAction('[Auth] Restore Session');
