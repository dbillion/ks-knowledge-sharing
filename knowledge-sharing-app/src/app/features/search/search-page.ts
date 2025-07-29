import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchInterfaceComponent } from './search-interface/search-interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    SearchInterfaceComponent
  ],
  template: `
    <div class="search-page">
      <!-- Search Navigation -->
      <div class="search-navigation">
        <nav mat-tab-nav-bar [backgroundColor]="'primary'">
          <a mat-tab-link 
             routerLink="/search" 
             routerLinkActive="active-link"
             [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>search</mat-icon>
            Quick Search
          </a>
          <a mat-tab-link 
             routerLink="/search/advanced" 
             routerLinkActive="active-link">
            <mat-icon>tune</mat-icon>
            Advanced Search
          </a>
        </nav>
      </div>

      <!-- Search Content -->
      <div class="search-content">
        <router-outlet>
          <app-search-interface></app-search-interface>
        </router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .search-page {
      min-height: 100vh;
      background: #fafafa;
    }

    .search-navigation {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      .mat-mdc-tab-nav-bar {
        border-bottom: none;
      }
      
      .mat-mdc-tab-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 150px;
        
        mat-icon {
          font-size: 1.25rem;
        }
      }
      
      .active-link {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .search-content {
      padding: 1rem 0;
    }

    @media (max-width: 768px) {
      .search-navigation {
        .mat-mdc-tab-link {
          min-width: 120px;
          font-size: 0.875rem;
          
          mat-icon {
            font-size: 1rem;
          }
        }
      }
    }
  `]
})
export class SearchPageComponent {
}
