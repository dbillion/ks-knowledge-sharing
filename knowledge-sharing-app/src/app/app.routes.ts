import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Home route (public)
  {
    path: '',
    loadComponent: () => import('./shared/components/home/home').then(m => m.HomeComponent)
  },
  
  // Auth routes (public)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  
  // Profile route (protected)
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/profile/profile').then(m => m.ProfileComponent)
  },
  
  // Settings route (protected)
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/profile/profile').then(m => m.ProfileComponent)
  },
  
  // My Articles route (protected)
  {
    path: 'my-articles',
    canActivate: [authGuard],
    loadComponent: () => import('./features/knowledge-base/article-list/article-list').then(m => m.ArticleListComponent)
  },
  
  // Knowledge base routes (protected)
  {
    path: 'knowledge',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/knowledge-base/article-list/article-list').then(m => m.ArticleListComponent)
      },
      {
        path: 'create',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'editor'] },
        loadComponent: () => import('./features/knowledge-base/article-create/article-create').then(m => m.ArticleCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/knowledge-base/article-detail/article-detail').then(m => m.ArticleDetailComponent)
      }
    ]
  },
  
  // Search routes (protected)
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./features/search/search-interface/search-interface').then(m => m.SearchInterfaceComponent)
  },
  
  // Categories routes (admin only)
  {
    path: 'categories',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./features/categories/category-tree/category-tree').then(m => m.CategoryTreeComponent)
  },
  
  // Catch-all redirect to home
  {
    path: '**',
    redirectTo: '/'
  }
];
