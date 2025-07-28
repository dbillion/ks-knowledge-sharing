import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { KnowledgeService, SimpleArticle } from '../../../core/services/knowledge.service';
import { CategoryService, SimpleCategory } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './article-list.html',
  styleUrl: './article-list.scss'
})
export class ArticleListComponent {
  private knowledgeService = inject(KnowledgeService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  // State management with signals
  articles = signal<SimpleArticle[]>([]);
  categories = signal<SimpleCategory[]>([]);
  isLoading = signal(true);
  totalArticles = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);

  // Computed properties
  isAuthenticated = this.authService.isAuthenticated;
  canCreateArticles = this.authService.isEditor;
  
  // Filtered articles based on current page
  paginatedArticles = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.articles().slice(start, end);
  });

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    
    // Load articles and categories in parallel
    Promise.all([
      this.knowledgeService.getPublishedArticles().toPromise(),
      this.categoryService.getCategories().toPromise()
    ]).then(([articles, categories]) => {
      this.articles.set(articles || []);
      this.categories.set(categories || []);
      this.totalArticles.set(articles?.length || 0);
      this.isLoading.set(false);
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading.set(false);
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  getArticlePreview(content: string): string {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
