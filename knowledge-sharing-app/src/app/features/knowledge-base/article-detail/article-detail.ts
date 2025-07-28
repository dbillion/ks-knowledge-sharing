import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { KnowledgeService, SimpleArticle } from '../../../core/services/knowledge.service';
import { CategoryService, SimpleCategory } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { switchMap, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private knowledgeService = inject(KnowledgeService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Reactive state management with signals
  article = signal<SimpleArticle | null>(null);
  category = signal<SimpleCategory | null>(null);
  isLoading = signal(true);
  isError = signal(false);
  errorMessage = signal('');

  // Computed properties
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  canEdit = computed(() => {
    const article = this.article();
    const user = this.currentUser();
    if (!article || !user) return false;
    
    // User can edit if they are admin, editor, or the author
    return user.role === 'admin' || 
           user.role === 'editor' || 
           article.authorId === user.id;
  });

  canDelete = computed(() => {
    const user = this.currentUser();
    return user?.role === 'admin';
  });

  ngOnInit(): void {
    this.loadArticle();
  }

  private loadArticle(): void {
    this.isLoading.set(true);
    this.isError.set(false);

    // Get article ID from route parameters using modern Angular approach
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.handleError('No article ID provided');
          return EMPTY;
        }
        return this.knowledgeService.getArticleById(id);
      }),
      catchError(error => {
        this.handleError('Failed to load article');
        return of(null);
      })
    ).subscribe(article => {
      if (article) {
        this.article.set(article);
        this.loadCategory(article.categoryId);
      } else {
        this.handleError('Article not found');
      }
      this.isLoading.set(false);
    });
  }

  private loadCategory(categoryId: string): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category) => {
        this.category.set(category || null);
      },
      error: (error) => {
        console.error('Failed to load category:', error);
      }
    });
  }

  private handleError(message: string): void {
    this.isError.set(true);
    this.errorMessage.set(message);
    this.isLoading.set(false);
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  onEdit(): void {
    const article = this.article();
    if (article) {
      this.router.navigate(['/knowledge/edit', article.id]);
    }
  }

  onDelete(): void {
    const article = this.article();
    if (!article) return;

    // In a real app, you would open a confirmation dialog
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      this.knowledgeService.deleteArticle(article.id).subscribe({
        next: () => {
          this.snackBar.open('Article deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/knowledge']);
        },
        error: (error) => {
          console.error('Failed to delete article:', error);
          this.snackBar.open('Failed to delete article', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onTogglePublished(): void {
    const article = this.article();
    if (!article) return;

    this.knowledgeService.togglePublishStatus(article.id).subscribe({
      next: (updatedArticle) => {
        this.article.set(updatedArticle);
        const status = updatedArticle.isPublished ? 'published' : 'unpublished';
        this.snackBar.open(`Article ${status} successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Failed to toggle publish status:', error);
        this.snackBar.open('Failed to update article status', 'Close', { duration: 3000 });
      }
    });
  }

  onShare(): void {
    const article = this.article();
    if (!article) return;

    const url = window.location.href;
    
    // Modern Web Share API with fallback
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: this.getArticlePreview(article.content),
        url: url
      }).catch(error => {
        console.log('Error sharing:', error);
        this.copyToClipboard(url);
      });
    } else {
      this.copyToClipboard(url);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Link copied to clipboard', 'Close', { duration: 2000 });
    }).catch(() => {
      this.snackBar.open('Failed to copy link', 'Close', { duration: 2000 });
    });
  }

  onBack(): void {
    this.router.navigate(['/knowledge']);
  }

  getArticlePreview(content: string): string {
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
