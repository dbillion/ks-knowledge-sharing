import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { KnowledgeService, SimpleArticle } from '../../../core/services/knowledge.service';
import { CategoryService, SimpleCategory } from '../../../core/services/category.service';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './article-create.html',
  styleUrl: './article-create.scss'
})
export class ArticleCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private knowledgeService = inject(KnowledgeService);
  private categoryService = inject(CategoryService);

  articleForm: FormGroup;
  categories = signal<SimpleCategory[]>([]);
  isLoading = signal(false);
  tags = signal<string[]>([]);

  constructor() {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', Validators.required],
      tags: [''],
      isPublished: [false]
    });

    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: SimpleCategory[]) => {
        this.categories.set(categories);
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
      }
    });
  }

  addTag(tagInput: HTMLInputElement): void {
    const tag = tagInput.value.trim();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      tagInput.value = '';
    }
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  onSubmit(): void {
    if (this.articleForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      
      const formValue = this.articleForm.value;
      const article: Omit<SimpleArticle, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> = {
        title: formValue.title,
        content: formValue.content,
        categoryId: formValue.categoryId,
        tags: this.tags(),
        isPublished: formValue.isPublished
      };

      this.knowledgeService.createArticle(article).subscribe({
        next: (createdArticle: SimpleArticle) => {
          this.snackBar.open('Article created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/knowledge']);
        },
        error: (error: any) => {
          console.error('Error creating article:', error);
          this.snackBar.open('Error creating article', 'Close', { duration: 3000 });
          this.isLoading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/knowledge']);
  }
}
