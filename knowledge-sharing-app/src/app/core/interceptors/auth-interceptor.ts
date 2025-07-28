import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  
  // Don't add token to auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }
  
  // Add token to request if available
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq).pipe(
      catchError(error => {
        // If 401 unauthorized, try to refresh token
        if (error.status === 401 && !req.url.includes('/refresh')) {
          return authService.refreshToken().pipe(
            switchMap(newToken => {
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            }),
            catchError(refreshError => {
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};
