import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>Welcome to Knowledge Sharing Platform</h1>
        <p>Discover, share, and manage knowledge efficiently with your team</p>
        <div class="hero-actions">
          @if (isAuthenticated()) {
            <button mat-raised-button color="primary" routerLink="/knowledge">
              <mat-icon>explore</mat-icon>
              Browse Articles
            </button>
            @if (canCreateArticles()) {
              <button mat-stroked-button color="primary" routerLink="/knowledge/create">
                <mat-icon>add</mat-icon>
                Create Article
              </button>
            }
          } @else {
            <button mat-raised-button color="primary" routerLink="/auth/login">
              <mat-icon>login</mat-icon>
              Sign In
            </button>
            <button mat-stroked-button color="primary" routerLink="/auth/register">
              <mat-icon>person_add</mat-icon>
              Register
            </button>
          }
        </div>
      </div>

      <div class="features-section">
        <h2>Platform Features</h2>
        <mat-grid-list cols="3" rowHeight="200px" gutterSize="20px" class="features-grid">
          <mat-grid-tile>
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">library_books</mat-icon>
                <h3>Knowledge Base</h3>
                <p>Organize and access your team's knowledge in one centralized location</p>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">search</mat-icon>
                <h3>Advanced Search</h3>
                <p>Find information quickly with powerful search and intelligent filtering</p>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">group</mat-icon>
                <h3>Collaboration</h3>
                <p>Work together with comments, version control, and real-time editing</p>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
      </div>

      @if (isAuthenticated()) {
        <div class="user-section">
          <mat-card class="user-card">
            <mat-card-content>
              <h2>Welcome back, {{ userDisplayName() }}!</h2>
              <p>Your role: <span class="user-role">{{ userRole() | titlecase }}</span></p>
              <div class="quick-actions">
                <button mat-stroked-button routerLink="/knowledge">
                  <mat-icon>article</mat-icon>
                  My Articles
                </button>
                <button mat-stroked-button routerLink="/search">
                  <mat-icon>search</mat-icon>
                  Search
                </button>
                @if (isAdmin()) {
                  <button mat-stroked-button routerLink="/categories">
                    <mat-icon>category</mat-icon>
                    Manage Categories
                  </button>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }

      <div class="stats-section">
        <mat-card class="stats-card">
          <mat-card-content>
            <h2>Platform Statistics</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">150+</span>
                <span class="stat-label">Articles</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">25</span>
                <span class="stat-label">Categories</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">500+</span>
                <span class="stat-label">Page Views</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">15</span>
                <span class="stat-label">Contributors</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: './home.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);

  // Computed signals following Angular 20+ best practices
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly currentUser = this.authService.currentUser;
  protected readonly userRole = computed(() => this.currentUser()?.role || '');
  protected readonly userDisplayName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
  protected readonly isAdmin = computed(() => this.userRole() === 'admin');
  protected readonly canCreateArticles = computed(() => 
    ['admin', 'editor'].includes(this.userRole())
  );
}
