import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

// Simplified category interface for mock service
export interface SimpleCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Mock categories for development
  private mockCategories = signal<SimpleCategory[]>([
    {
      id: 'cat1',
      name: 'Frontend Development',
      description: 'Articles about frontend technologies and frameworks',
      isActive: true
    },
    {
      id: 'cat2',
      name: 'Backend Development',
      description: 'Server-side development and architecture',
      isActive: true
    },
    {
      id: 'cat3',
      name: 'UI/UX Design',
      description: 'User interface and user experience design',
      isActive: true
    },
    {
      id: 'cat4',
      name: 'DevOps',
      description: 'Deployment, CI/CD, and infrastructure',
      isActive: true
    },
    {
      id: 'cat5',
      name: 'Testing',
      description: 'Testing strategies and tools',
      isActive: true
    }
  ]);

  // Get all categories
  getCategories(): Observable<SimpleCategory[]> {
    return of(this.mockCategories()).pipe(delay(300));
  }

  // Get active categories only
  getActiveCategories(): Observable<SimpleCategory[]> {
    const activeCategories = this.mockCategories().filter(cat => cat.isActive);
    return of(activeCategories).pipe(delay(300));
  }

  // Get category by ID
  getCategoryById(id: string): Observable<SimpleCategory | undefined> {
    const category = this.mockCategories().find(cat => cat.id === id);
    return of(category).pipe(delay(200));
  }

  // Create new category
  createCategory(categoryData: Omit<SimpleCategory, 'id'>): Observable<SimpleCategory> {
    const newCategory: SimpleCategory = {
      ...categoryData,
      id: this.generateId()
    };

    this.mockCategories.update(categories => [...categories, newCategory]);
    return of(newCategory).pipe(delay(500));
  }

  // Update category
  updateCategory(id: string, updates: Partial<SimpleCategory>): Observable<SimpleCategory> {
    this.mockCategories.update(categories => 
      categories.map(category => 
        category.id === id 
          ? { ...category, ...updates }
          : category
      )
    );
    
    const updatedCategory = this.mockCategories().find(cat => cat.id === id);
    return of(updatedCategory!).pipe(delay(400));
  }

  // Delete category
  deleteCategory(id: string): Observable<boolean> {
    this.mockCategories.update(categories => 
      categories.filter(category => category.id !== id)
    );
    return of(true).pipe(delay(400));
  }

  // Helper method to generate mock IDs
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}