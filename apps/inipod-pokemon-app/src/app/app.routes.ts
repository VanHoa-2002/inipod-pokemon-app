import { Route } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './features/home/pages/layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./features/auth/pages/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'auth/recovery-password',
    loadComponent: () =>
      import(
        './features/auth/pages/recovery-password/recovery-password.component'
      ).then((m) => m.RecoveryPasswordComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'pokemon',
        loadComponent: () =>
          import(
            './features/home/pages/pokemon-list/pokemon-list.component'
          ).then((m) => m.PokemonListComponent),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
