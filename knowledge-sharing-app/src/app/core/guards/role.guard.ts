import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data?.['roles'] as string[] || [];
  const currentUser = authService.currentUser();
  
  console.log('Role guard check:', { currentUser, requiredRoles }); // Debug log
  
  if (!currentUser) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  if (requiredRoles.length === 0) {
    return true; // No specific role required
  }
  
  const hasRequiredRole = requiredRoles.includes(currentUser.role);
  if (!hasRequiredRole) {
    console.log('User lacks required role. Current:', currentUser.role, 'Required:', requiredRoles);
    router.navigate(['/']);
    return false;
  }
  
  return true;
};