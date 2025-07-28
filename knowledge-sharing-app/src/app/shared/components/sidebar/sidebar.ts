import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';

interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavigationItem[];
  badge?: number;
  roles?: string[];
  action?: () => void;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);

  // State management
  currentUser = this.authService.currentUser;
  isCollapsed = signal(false);
  currentRoute = signal('');
  categories = signal<any[]>([]);

  // Computed properties
  userRole = computed(() => this.currentUser()?.role || 'viewer');
  canCreateContent = computed(() => ['admin', 'editor'].includes(this.userRole()));
  canManageUsers = computed(() => this.userRole() === 'admin');

  // Navigation items
  navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Knowledge Base',
      icon: 'library_books',
      children: [
        {
          label: 'Browse Articles',
          icon: 'article',
          route: '/articles'
        },
        {
          label: 'My Articles',
          icon: 'person',
          route: '/articles/my'
        },
        {
          label: 'Drafts',
          icon: 'drafts',
          route: '/articles/drafts',
          badge: 3
        },
        {
          label: 'Favorites',
          icon: 'favorite',
          route: '/articles/favorites'
        }
      ]
    },
    {
      label: 'Categories',
      icon: 'category',
      children: [
        {
          label: 'Browse Categories',
          icon: 'folder',
          route: '/categories'
        },
        {
          label: 'Manage Categories',
          icon: 'settings',
          route: '/categories/manage',
          roles: ['admin', 'editor']
        }
      ]
    },
    {
      label: 'Search',
      icon: 'search',
      route: '/search'
    },
    {
      label: 'Collaboration',
      icon: 'groups',
      children: [
        {
          label: 'Recent Activity',
          icon: 'timeline',
          route: '/activity'
        },
        {
          label: 'Comments',
          icon: 'comment',
          route: '/comments',
          badge: 5
        },
        {
          label: 'Version History',
          icon: 'history',
          route: '/versions'
        }
      ]
    }
  ];

  // Quick actions
  quickActions: NavigationItem[] = [
    {
      label: 'New Article',
      icon: 'add',
      route: '/articles/new',
      roles: ['admin', 'editor']
    },
    {
      label: 'Quick Search',
      icon: 'search',
      action: () => this.openQuickSearch()
    }
  ];

  // Admin navigation
  adminItems: NavigationItem[] = [
    {
      label: 'User Management',
      icon: 'people',
      route: '/admin/users',
      roles: ['admin']
    },
    {
      label: 'System Settings',
      icon: 'settings',
      route: '/admin/settings',
      roles: ['admin']
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      route: '/admin/analytics',
      roles: ['admin']
    }
  ];

  constructor() {
    // Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });

    // Initialize current route
    this.currentRoute.set(this.router.url);

    // Load categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  executeAction(action: () => void): void {
    action();
  }

  // Sidebar controls
  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  collapseSidebar(): void {
    this.isCollapsed.set(true);
  }

  expandSidebar(): void {
    this.isCollapsed.set(false);
  }

  // Helper methods
  isActiveRoute(route: string): boolean {
    return this.currentRoute().startsWith(route);
  }

  hasAccess(item: NavigationItem): boolean {
    if (!item.roles) return true;
    return item.roles.includes(this.userRole());
  }

  openQuickSearch(): void {
    // Implement quick search modal/overlay
    console.log('Opening quick search...');
  }

  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/articles'], { 
      queryParams: { category: categoryId } 
    });
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
