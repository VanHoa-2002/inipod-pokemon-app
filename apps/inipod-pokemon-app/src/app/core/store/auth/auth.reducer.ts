import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.signupSuccess, (state, { token, user }) => ({
    ...state,
    loading: false,
    token,
    user,
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      loading: false,
      token,
      user,
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return initialAuthState;
  }),
  on(AuthActions.recoverPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.recoverPasswordSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.recoverPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
