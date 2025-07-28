import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data?.['roles'] as string[] || [];
  
  return authService.currentUser$.pipe(
    map(user => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }
      
      if (requiredRoles.length === 0) {
        return true; // No specific role required
      }
      
      const hasRequiredRole = requiredRoles.includes(user.role);
      if (!hasRequiredRole) {
        router.navigate(['/unauthorized']);
        return false;
      }
      
      return true;
    })
  );
};