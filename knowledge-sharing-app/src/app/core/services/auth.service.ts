import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, throwError } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'viewer';
  token?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock users data
  private mockUsers: User[] = [
    {
      id: 'user1',
      username: 'admin',
      email: 'admin@knowledge.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      token: 'mock-admin-token',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date()
    },
    {
      id: 'user2',
      username: 'editor',
      email: 'editor@knowledge.com',
      firstName: 'Editor',
      lastName: 'User',
      role: 'editor',
      token: 'mock-editor-token',
      isActive: true,
      createdAt: new Date('2024-01-02'),
      lastLoginAt: new Date()
    },
    {
      id: 'user3',
      username: 'viewer',
      email: 'viewer@knowledge.com',
      firstName: 'Viewer',
      lastName: 'User',
      role: 'viewer',
      token: 'mock-viewer-token',
      isActive: true,
      createdAt: new Date('2024-01-03'),
      lastLoginAt: new Date()
    }
  ];

  // Signals for reactive state management
  currentUser = signal<User | null>(null);
  isLoading = signal(false);

  // Computed signals
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || 'viewer');
  isAdmin = computed(() => this.userRole() === 'admin');
  isEditor = computed(() => ['admin', 'editor'].includes(this.userRole()));

  constructor(private router: Router) {
    // Check for existing session on service initialization
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.isLoading.set(true);

    // Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => 
          u.email === credentials.email && credentials.password === 'password123'
        );

        if (user) {
          const userWithToken = { ...user, lastLoginAt: new Date() };
          this.currentUser.set(userWithToken);
          localStorage.setItem('currentUser', JSON.stringify(userWithToken));
          this.isLoading.set(false);
          observer.next(userWithToken);
          observer.complete();
        } else {
          this.isLoading.set(false);
          observer.error(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  register(userData: RegisterData): Observable<User> {
    this.isLoading.set(true);

    // Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = this.mockUsers.find(u => 
          u.email === userData.email || u.username === userData.username
        );

        if (existingUser) {
          this.isLoading.set(false);
          observer.error(new Error('User already exists'));
          return;
        }

        const newUser: User = {
          id: `user${this.mockUsers.length + 1}`,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'viewer', // Default role
          token: `mock-token-${Date.now()}`,
          isActive: true,
          createdAt: new Date(),
          lastLoginAt: new Date()
        };

        this.mockUsers.push(newUser);
        this.currentUser.set(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.isLoading.set(false);
        observer.next(newUser);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  getDefaultRouteForRole(role: string): string {
    switch (role) {
      case 'admin':
        return '/categories';
      case 'editor':
        return '/knowledge/create';
      case 'viewer':
        return '/knowledge';
      default:
        return '/';
    }
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.userRole();
    return roles.includes(userRole);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    this.isLoading.set(true);

    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.currentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          this.currentUser.set(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.isLoading.set(false);
          observer.next(updatedUser);
          observer.complete();
        } else {
          this.isLoading.set(false);
          observer.error(new Error('No user logged in'));
        }
      }, 500);
    });
  }

  refreshToken(): Observable<string> {
    const currentUser = this.currentUser();
    if (currentUser) {
      const newToken = `mock-token-${Date.now()}`;
      const updatedUser = { ...currentUser, token: newToken };
      this.currentUser.set(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return of(newToken).pipe(delay(300));
    }
    return throwError(() => new Error('No user logged in'));
  }
}