import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/auth/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }
    })
  );
};