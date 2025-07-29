import { Component, signal, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { SearchService } from '../../../core/services/search.service';
import { SimpleArticle } from '../../../core/services/knowledge.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss'
})
export class SearchResultsComponent {
  searchService = inject(SearchService);

  // Input for standalone usage
  articles = input<SimpleArticle[]>([]);
  
  // State from SearchService
  searchResults = this.searchService.results;
  isSearching = this.searchService.loading;
  hasResults = this.searchService.hasResults;
  hasQuery = this.searchService.hasQuery;
  resultSummary = this.searchService.resultSummary;
  currentQuery = this.searchService.currentQuery;

  // Local state for pagination
  currentPage = signal(0);
  pageSize = signal(10);
  
  // Computed properties
  displayedArticles = computed(() => {
    const allArticles = this.articles().length > 0 ? this.articles() : this.searchResults().articles;
    const startIndex = this.currentPage() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return allArticles.slice(startIndex, endIndex);
  });

  totalArticles = computed(() => {
    return this.articles().length > 0 ? this.articles().length : this.searchResults().totalCount;
  });

  hasNoResults = computed(() => {
    return this.hasQuery() && !this.isSearching() && !this.hasResults();
  });

  // Methods
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  getImageUrl(article: SimpleArticle): string {
    // Prefer thumbnail for list view, fallback to main image or placeholder
    if (article.thumbnailUrl) {
      return article.thumbnailUrl;
    }
    if (article.imageUrl) {
      return article.imageUrl;
    }
    return this.getPlaceholderImage(article);
  }

  getPlaceholderImage(article: SimpleArticle): string {
    // Generate a placeholder based on article category
    const colors = ['4CAF50', '2196F3', 'FF9800', '9C27B0', 'F44336', '607D8B'];
    const colorIndex = article.categoryId.length % colors.length;
    const color = colors[colorIndex];
    const title = encodeURIComponent(article.title.substring(0, 20));
    return `https://via.placeholder.com/300x200/${color}/white?text=${title}`;
  }

  getArticlePreview(content: string): string {
    // Remove HTML tags and get preview text
    const textContent = content.replace(/<[^>]*>/g, '');
    
    // Remove base64 image data if present
    const cleanContent = textContent.replace(/data:image\/[^;]+;base64[^"'\s]*/g, '[Image]');
    
    return cleanContent.length > 200 ? cleanContent.substring(0, 200) + '...' : cleanContent;
  }

  onImageError(event: any, article: SimpleArticle): void {
    event.target.src = this.getPlaceholderImage(article);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  shareArticle(article: SimpleArticle): void {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: this.getArticlePreview(article.content),
        url: `/articles/${article.id}`
      });
    } else {
      // Fallback: copy URL to clipboard
      const url = `${window.location.origin}/articles/${article.id}`;
      navigator.clipboard.writeText(url).then(() => {
        // You might want to show a toast notification here
        console.log('URL copied to clipboard');
      });
    }
  }

  trackByArticleId(index: number, article: SimpleArticle): string {
    return article.id;
  }
}
