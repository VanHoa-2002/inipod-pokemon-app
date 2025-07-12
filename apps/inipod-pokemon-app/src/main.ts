import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Store } from '@ngrx/store';
import * as AuthActions from './app/core/store/auth/auth.action';

bootstrapApplication(App, appConfig)
  .then((ref) => {
    ref.injector.get(Store).dispatch(AuthActions.restoreSession());
  })
  .catch((err) => console.error(err));
