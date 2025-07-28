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
    
    // Load articles and categories
    this.knowledgeService.getPublishedArticles().subscribe({
      next: (articles) => {
        this.articles.set(articles || []);
        this.totalArticles.set(articles?.length || 0);
        console.log('Loaded articles:', articles); // Debug log
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories || []);
        console.log('Loaded categories:', categories); // Debug log
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
      }
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
    // Remove HTML tags and extract text content
    const textContent = content.replace(/<[^>]*>/g, '');
    // Remove base64 image data if present
    const cleanContent = textContent.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
    // Remove extra whitespace
    const trimmedContent = cleanContent.replace(/\s+/g, ' ').trim();
    
    return trimmedContent.length > 200 ? trimmedContent.substring(0, 200) + '...' : trimmedContent;
  }

  getImageUrl(article: SimpleArticle): string | null {
    // First check if there's a thumbnail URL
    if (article.thumbnailUrl) {
      return article.thumbnailUrl;
    }
    
    // If no thumbnail, check for image URL
    if (article.imageUrl) {
      return article.imageUrl;
    }
    
    // Try to extract first image from content
    const imageMatch = article.content.match(/<img[^>]+src="([^"]+)"/);
    if (imageMatch) {
      return imageMatch[1];
    }
    
    return null;
  }

  getPlaceholderImage(categoryId: string): string {
    // Return different placeholder images based on category
    const placeholders = {
      'cat1': 'https://via.placeholder.com/300x200/4CAF50/white?text=Angular',
      'cat2': 'https://via.placeholder.com/300x200/2196F3/white?text=TypeScript',
      'cat3': 'https://via.placeholder.com/300x200/FF9800/white?text=UI/UX',
      'default': 'https://via.placeholder.com/300x200/9E9E9E/white?text=Article'
    };
    
    return placeholders[categoryId as keyof typeof placeholders] || placeholders.default;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      // Get the article from the context if available, or use a generic placeholder
      const fallbackSrc = 'https://via.placeholder.com/300x200/E0E0E0/757575?text=No+Image';
      
      // Prevent infinite error loop
      if (imgElement.src !== fallbackSrc) {
        imgElement.src = fallbackSrc;
      } else {
        imgElement.style.display = 'none';
      }
    }
  }
}
