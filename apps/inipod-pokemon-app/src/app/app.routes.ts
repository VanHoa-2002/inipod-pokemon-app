import { Route } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './features/layout/layout.component';

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
        path: '',
        loadComponent: () =>
          import('./features/layout/pages/home-page/home-page.component').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'pokemon',
        loadComponent: () =>
          import(
            './features/layout/pages/pokemon-list/pokemon-list.component'
          ).then((m) => m.PokemonListComponent),
      },
      {
        path: 'documentary',
        loadComponent: () =>
          import(
            './features/layout/pages/documentary/documentary.component'
          ).then((m) => m.DocumentaryComponent),
      },
      {
        path: 'policy',
        loadComponent: () =>
          import('./features/layout/pages/policy/policy.component').then(
            (m) => m.PolicyComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/layout/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
