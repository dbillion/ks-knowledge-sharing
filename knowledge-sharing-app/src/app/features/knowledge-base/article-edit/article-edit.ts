import { Component, signal, inject, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { QuillModule } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';
import { KnowledgeService, SimpleArticle } from '../../../core/services/knowledge.service';
import { CategoryService, SimpleCategory } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatMenuModule,
    QuillModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './article-edit.html',
  styleUrl: './article-edit.scss'
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private knowledgeService = inject(KnowledgeService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();

  // State management
  articleId = signal<string | null>(null);
  article = signal<SimpleArticle | null>(null);
  categories = signal<SimpleCategory[]>([]);
  availableTags = signal<string[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  hasUnsavedChanges = signal(false);

  // Form
  articleForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    categoryId: ['', [Validators.required]],
    isPublished: [false],
    excerpt: ['']
  });
  selectedTags = signal<string[]>([]);

  // Quill editor configuration
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  // Computed properties
  currentUser = this.authService.currentUser;
  canEdit = computed(() => {
    const user = this.currentUser();
    const article = this.article();
    return user && article && (
      user.role === 'admin' || 
      user.role === 'editor' || 
      article.authorId === user.id
    );
  });

  isNewArticle = computed(() => !this.articleId());

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('ArticleEditComponent initialized'); // Debug log
    this.loadInitialData();
    this.setupFormChangeDetection();
    
    // Get article ID from route
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      console.log('Route params:', params, 'Article ID:', id); // Debug log
      this.articleId.set(id);
      if (id) {
        this.loadArticle(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      isPublished: [false],
      excerpt: ['']
    });
  }

  private setupFormChangeDetection(): void {
    this.articleForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.hasUnsavedChanges.set(true);
    });
  }

  private loadInitialData(): void {
    this.isLoading.set(true);
    
    // Load categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    // Load available tags
    this.knowledgeService.getPublishedArticles().subscribe(articles => {
      const tags = new Set<string>();
      articles.forEach(article => {
        article.tags.forEach(tag => tags.add(tag));
      });
      this.availableTags.set(Array.from(tags).sort());
      this.isLoading.set(false);
    });
  }

  private loadArticle(id: string): void {
    this.isLoading.set(true);
    
    this.knowledgeService.getArticleById(id).subscribe({
      next: (article: SimpleArticle | undefined) => {
        if (article) {
          this.article.set(article);
          this.populateForm(article);
        } else {
          this.snackBar.open('Article not found', 'Close', { duration: 3000 });
          this.router.navigate(['/knowledge']);
        }
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading article:', error);
        this.snackBar.open('Error loading article', 'Close', { duration: 3000 });
        this.router.navigate(['/knowledge']);
        this.isLoading.set(false);
      }
    });
  }

  private populateForm(article: SimpleArticle): void {
    this.articleForm.patchValue({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId,
      isPublished: article.isPublished,
      excerpt: article.excerpt || this.generateExcerpt(article.content)
    });
    
    this.selectedTags.set([...article.tags]);
    this.hasUnsavedChanges.set(false);
  }

  private generateExcerpt(content: string): string {
    // Strip HTML tags and get first 150 characters
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
  }

  // Form handlers
  onSaveArticle(): void {
    if (this.articleForm.valid && this.canEdit()) {
      this.isSaving.set(true);
      
      const formData = {
        ...this.articleForm.value,
        tags: this.selectedTags(),
        excerpt: this.articleForm.value.excerpt || this.generateExcerpt(this.articleForm.value.content)
      };

      const saveOperation = this.isNewArticle() 
        ? this.knowledgeService.createArticle(formData)
        : this.knowledgeService.updateArticle(this.articleId()!, formData);

      saveOperation.subscribe({
        next: (savedArticle) => {
          this.article.set(savedArticle);
          this.hasUnsavedChanges.set(false);
          this.isSaving.set(false);
          
          const message = this.isNewArticle() ? 'Article created successfully!' : 'Article updated successfully!';
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          if (this.isNewArticle()) {
            this.router.navigate(['/articles', savedArticle.id, 'edit']);
          }
        },
        error: (error) => {
          console.error('Error saving article:', error);
          this.snackBar.open('Failed to save article. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isSaving.set(false);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onSaveAsDraft(): void {
    this.articleForm.patchValue({ isPublished: false });
    this.onSaveArticle();
  }

  onPublish(): void {
    this.articleForm.patchValue({ isPublished: true });
    this.onSaveArticle();
  }

  onPreview(): void {
    if (this.article()) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/articles', this.article()!.id])
      );
      window.open(url, '_blank');
    }
  }

  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    
    if (this.isNewArticle()) {
      this.router.navigate(['/articles']);
    } else {
      this.router.navigate(['/articles', this.articleId()]);
    }
  }

  onDelete(): void {
    if (!this.article() || this.isNewArticle()) return;
    
    const confirmed = confirm('Are you sure you want to delete this article? This action cannot be undone.');
    if (confirmed) {
      this.knowledgeService.deleteArticle(this.articleId()!).subscribe({
        next: () => {
          this.snackBar.open('Article deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/articles']);
        },
        error: (error) => {
          console.error('Error deleting article:', error);
          this.snackBar.open('Failed to delete article', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  // Tag management
  onAddTag(tag: string): void {
    const trimmedTag = tag.trim();
    if (trimmedTag && !this.selectedTags().includes(trimmedTag)) {
      this.selectedTags.update(tags => [...tags, trimmedTag]);
      this.hasUnsavedChanges.set(true);
    }
  }

  onRemoveTag(tagToRemove: string): void {
    this.selectedTags.update(tags => tags.filter(tag => tag !== tagToRemove));
    this.hasUnsavedChanges.set(true);
  }

  // Content change handlers
  onContentChange(): void {
    this.hasUnsavedChanges.set(true);
    
    // Auto-generate excerpt if not manually set
    const excerptControl = this.articleForm.get('excerpt');
    if (!excerptControl?.value) {
      const content = this.articleForm.get('content')?.value || '';
      excerptControl?.setValue(this.generateExcerpt(content));
    }
  }

  onTitleChange(): void {
    this.hasUnsavedChanges.set(true);
  }

  // Helper methods
  private markFormGroupTouched(): void {
    Object.keys(this.articleForm.controls).forEach(key => {
      this.articleForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.articleForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters`;
    }
    return '';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  getWordCount(): number {
    const content = this.articleForm.get('content')?.value || '';
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
  }

  getReadingTime(): number {
    const wordsPerMinute = 200;
    return Math.ceil(this.getWordCount() / wordsPerMinute);
  }

  // Auto-save functionality
  autoSave(): void {
    if (this.hasUnsavedChanges() && this.articleForm.valid && !this.isNewArticle()) {
      // Implement auto-save logic here
      console.log('Auto-saving...');
    }
  }
}
