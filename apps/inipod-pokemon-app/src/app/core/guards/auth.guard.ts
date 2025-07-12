import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../store/auth/auth.selector';
import { Observable, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsLoggedIn).pipe(
      take(1),
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
