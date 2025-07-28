import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  
  // Reactive state from auth service
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  isLoading = this.authService.isLoading;
  
  // Computed properties
  userDisplayName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
  
  userInitials = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName[0]}${user.lastName[0]}` : '';
  });

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm.trim()) {
      // Navigate to search results
      console.log('Searching for:', searchTerm);
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  onProfileClick(): void {
    // Navigate to profile
    console.log('Navigate to profile');
  }

  onNotificationsClick(): void {
    // Show notifications
    console.log('Show notifications');
  }
}
