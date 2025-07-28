import { Component, signal, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService, SearchFilters } from '../../../core/services/search.service';
import { KnowledgeService, SimpleArticle } from '../../../core/services/knowledge.service';
import { CategoryService, SimpleCategory } from '../../../core/services/category.service';

@Component({
  selector: 'app-search-interface',
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
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatListModule
  ],
  templateUrl: './search-interface.html',
  styleUrl: './search-interface.scss'
})
export class SearchInterfaceComponent {
  searchService = inject(SearchService);
  private knowledgeService = inject(KnowledgeService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  // Search form controls
  searchControl = new FormControl('');
  
  // State management from SearchService
  searchResults = this.searchService.results;
  isSearching = this.searchService.loading;
  hasResults = this.searchService.hasResults;
  hasQuery = this.searchService.hasQuery;
  resultSummary = this.searchService.resultSummary;
  searchHistory = this.searchService.history;
  savedSearches = this.searchService.saved;
  
  // Local state
  categories = signal<SimpleCategory[]>([]);
  availableTags = signal<string[]>([]);
  showFilters = signal(false);
  showHistory = signal(false);
  
  // Popular searches for suggestions
  popularSearches = this.searchService.getPopularSearches();

  constructor() {
    this.loadInitialData();
    this.setupSearchSubscription();
  }

  private loadInitialData(): void {
    // Load categories
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    // Load all articles to extract available tags
    this.knowledgeService.getPublishedArticles().subscribe(articles => {
      const tags = new Set<string>();
      articles.forEach(article => {
        article.tags.forEach(tag => tags.add(tag));
      });
      this.availableTags.set(Array.from(tags).sort());
    });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        if (query && query.trim()) {
          this.searchService.search(query.trim());
        } else {
          this.searchService.clearSearch();
        }
      });
  }

  onSearch(): void {
    const query = this.searchControl.value;
    if (query && query.trim()) {
      this.searchService.search(query.trim());
    }
  }

  onCategoryToggle(categoryId: string): void {
    const currentFilters = this.searchService.currentFilters();
    const categories = [...currentFilters.categories];
    const index = categories.indexOf(categoryId);
    
    if (index > -1) {
      categories.splice(index, 1);
    } else {
      categories.push(categoryId);
    }
    
    this.searchService.updateFilters({ categories });
  }

  onTagToggle(tag: string): void {
    const currentFilters = this.searchService.currentFilters();
    const tags = [...currentFilters.tags];
    const index = tags.indexOf(tag);
    
    if (index > -1) {
      tags.splice(index, 1);
    } else {
      tags.push(tag);
    }
    
    this.searchService.updateFilters({ tags });
  }

  onPublishedOnlyToggle(): void {
    const currentFilters = this.searchService.currentFilters();
    this.searchService.updateFilters({ 
      publishedOnly: !currentFilters.publishedOnly 
    });
  }

  clearFilters(): void {
    this.searchService.updateFilters({
      categories: [],
      tags: [],
      publishedOnly: true
    });
  }

  selectFromHistory(query: string): void {
    this.searchControl.setValue(query);
    this.searchService.search(query);
    this.showHistory.set(false);
  }

  loadSavedSearch(searchId: string): void {
    this.searchService.loadSavedSearch(searchId);
  }

  saveCurrentSearch(): void {
    const name = prompt('Enter a name for this search:');
    if (name && name.trim()) {
      try {
        this.searchService.saveCurrentSearch(name.trim());
        alert('Search saved successfully!');
      } catch (error) {
        alert('Error saving search: ' + (error as Error).message);
      }
    }
  }

  deleteSavedSearch(searchId: string): void {
    if (confirm('Are you sure you want to delete this saved search?')) {
      this.searchService.deleteSavedSearch(searchId);
    }
  }

  exportResults(): void {
    const results = this.searchService.exportResults();
    const blob = new Blob([JSON.stringify(results, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  toggleFilters(): void {
    this.showFilters.update(show => !show);
  }

  toggleHistory(): void {
    this.showHistory.update(show => !show);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  getArticlePreview(content: string): string {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isCategorySelected(categoryId: string): boolean {
    return this.searchService.currentFilters().categories.includes(categoryId);
  }

  isTagSelected(tag: string): boolean {
    return this.searchService.currentFilters().tags.includes(tag);
  }
}
