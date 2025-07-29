import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { KnowledgeService } from '../../../core/services/knowledge.service';
import { CategoryService, SimpleCategory } from '../../../core/services/category.service';
import { SearchResultsComponent } from '../search-results/search-results';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

interface AdvancedSearchCriteria {
  query: string;
  categories: string[];
  tags: string[];
  authors: string[];
  publishedOnly: boolean;
  dateFrom: Date | null;
  dateTo: Date | null;
  contentLength: {
    min: number;
    max: number;
  };
}

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSliderModule,
    SearchResultsComponent,
    MatProgressSpinnerModule
],
  templateUrl: './advanced-search.html',
  styleUrl: './advanced-search.scss'
})
export class AdvancedSearchComponent {
  private fb = inject(FormBuilder);
  private searchService = inject(SearchService);
  private knowledgeService = inject(KnowledgeService);
  private categoryService = inject(CategoryService);

  // Form
  searchForm: FormGroup;
  
  // Data for dropdowns
  categories = signal<SimpleCategory[]>([]);
  availableTags = signal<string[]>([]);
  availableAuthors = signal<string[]>([]);
  
  // Search state
  isSearching = signal(false);
  searchResults = signal<any[]>([]);
  
  // UI state
  showResults = signal(false);

  constructor() {
    this.searchForm = this.fb.group({
      query: [''],
      categories: [[]],
      tags: [[]],
      authors: [[]],
      publishedOnly: [true],
      dateFrom: [null],
      dateTo: [null],
      contentLengthMin: [0],
      contentLengthMax: [10000]
    });

    this.loadInitialData();
    this.setupFormEffects();
  }

  private loadInitialData(): void {
    // Load categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    // Load all articles to extract tags and authors
    this.knowledgeService.getArticles().subscribe(articles => {
      // Extract unique tags
      const allTags = new Set<string>();
      const allAuthors = new Set<string>();
      
      articles.forEach(article => {
        article.tags.forEach(tag => allTags.add(tag));
        allAuthors.add(article.authorId);
      });
      
      this.availableTags.set(Array.from(allTags).sort());
      this.availableAuthors.set(Array.from(allAuthors).sort());
    });
  }

  private setupFormEffects(): void {
    // Auto-search when form changes (with debounce)
    let timeout: any;
    
    effect(() => {
      // Listen for form changes
      this.searchForm.valueChanges?.subscribe(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (this.shouldAutoSearch()) {
            this.performSearch();
          }
        }, 500);
      });
    });
  }

  private shouldAutoSearch(): boolean {
    const formValue = this.searchForm.value;
    return !!(
      formValue.query?.trim() ||
      formValue.categories?.length > 0 ||
      formValue.tags?.length > 0 ||
      formValue.authors?.length > 0
    );
  }

  onSearch(): void {
    this.performSearch();
  }

  private performSearch(): void {
    if (!this.searchForm.valid) return;

    this.isSearching.set(true);
    this.showResults.set(true);

    const criteria = this.buildSearchCriteria();
    
    this.knowledgeService.advancedSearch(criteria).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isSearching.set(false);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching.set(false);
      }
    });
  }

  private buildSearchCriteria(): any {
    const formValue = this.searchForm.value;
    
    return {
      query: formValue.query?.trim() || undefined,
      categories: formValue.categories?.length > 0 ? formValue.categories : undefined,
      tags: formValue.tags?.length > 0 ? formValue.tags : undefined,
      authors: formValue.authors?.length > 0 ? formValue.authors : undefined,
      publishedOnly: formValue.publishedOnly,
      dateFrom: formValue.dateFrom || undefined,
      dateTo: formValue.dateTo || undefined
    };
  }

  onReset(): void {
    this.searchForm.reset({
      query: '',
      categories: [],
      tags: [],
      authors: [],
      publishedOnly: true,
      dateFrom: null,
      dateTo: null,
      contentLengthMin: 0,
      contentLengthMax: 10000
    });
    this.showResults.set(false);
    this.searchResults.set([]);
  }

  onSaveSearch(): void {
    const name = prompt('Enter a name for this search:');
    if (name?.trim()) {
      try {
        // Convert advanced search to basic search format for saving
        const query = this.searchForm.value.query || 'Advanced Search';
        const filters = {
          categories: this.searchForm.value.categories || [],
          tags: this.searchForm.value.tags || [],
          publishedOnly: this.searchForm.value.publishedOnly
        };
        
        // Temporarily set the search service state to save
        this.searchService.search(query, filters);
        this.searchService.saveCurrentSearch(name.trim());
        
        alert('Search saved successfully!');
      } catch (error) {
        alert('Error saving search: ' + (error as Error).message);
      }
    }
  }

  exportResults(): void {
    const results = this.searchResults();
    const criteria = this.buildSearchCriteria();
    
    const exportData = {
      searchCriteria: criteria,
      searchDate: new Date().toISOString(),
      totalResults: results.length,
      results: results.map(article => ({
        id: article.id,
        title: article.title,
        author: article.authorId,
        category: article.categoryId,
        tags: article.tags,
        createdAt: article.createdAt,
        isPublished: article.isPublished
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced-search-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Utility methods
  getCategoryName(categoryId: string): string {
    const category = this.categories().find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getResultCount(): number {
    return this.searchResults().length;
  }

  hasResults(): boolean {
    return this.searchResults().length > 0;
  }
}
