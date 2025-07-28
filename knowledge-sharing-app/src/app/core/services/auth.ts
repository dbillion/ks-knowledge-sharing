import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  UserProfile 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = '/api/v1/auth';
  
  // Signal-based state management
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(localStorage.getItem('access_token'));
  private loadingSignal = signal<boolean>(false);
  
  // Public reactive state
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly isEditor = computed(() => ['admin', 'editor'].includes(this.currentUser()?.role || ''));
  
  // Observable versions for compatibility with existing code
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize user from token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      this.loadCurrentUser().subscribe();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => this.setAuthData(response)),
        catchError(this.handleError),
        tap(() => this.loadingSignal.set(false))
      );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => this.setAuthData(response)),
        catchError(this.handleError),
        tap(() => this.loadingSignal.set(false))
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<{ accessToken: string }>(`${this.API_URL}/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.accessToken);
        this.tokenSignal.set(response.accessToken);
      }),
      map(response => response.accessToken),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`)
      .pipe(
        tap(user => {
          this.currentUserSignal.set(user);
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  updateProfile(profile: UserProfile): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, profile)
      .pipe(
        tap(user => {
          this.currentUserSignal.set(user);
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    this.currentUserSignal.set(response.user);
    this.tokenSignal.set(response.accessToken);
    this.currentUserSubject.next(response.user);
  }

  private loadCurrentUser(): Observable<User> {
    return this.getCurrentUser();
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Auth Error:', error);
    this.loadingSignal.set(false);
    
    // Handle specific error cases
    if (error.status === 401) {
      this.logout();
    }
    
    return throwError(() => error);
  };
}
