import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdvancedSearchComponent } from './advanced-search';
import { SearchService } from '../../../core/services/search.service';
import { KnowledgeService } from '../../../core/services/knowledge.service';
import { CategoryService } from '../../../core/services/category.service';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockKnowledgeService: jasmine.SpyObj<KnowledgeService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['search', 'saveCurrentSearch']);
    const knowledgeServiceSpy = jasmine.createSpyObj('KnowledgeService', ['getArticles', 'advancedSearch']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);

    await TestBed.configureTestingModule({
      imports: [
        AdvancedSearchComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: KnowledgeService, useValue: knowledgeServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    mockSearchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    mockKnowledgeService = TestBed.inject(KnowledgeService) as jasmine.SpyObj<KnowledgeService>;
    mockCategoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;

    // Setup mock returns
    mockCategoryService.getCategories.and.returnValue(of([]));
    mockKnowledgeService.getArticles.and.returnValue(of([]));
    mockKnowledgeService.advancedSearch.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.searchForm.get('publishedOnly')?.value).toBe(true);
    expect(component.searchForm.get('contentLengthMin')?.value).toBe(0);
    expect(component.searchForm.get('contentLengthMax')?.value).toBe(10000);
  });

  it('should reset form correctly', () => {
    component.searchForm.patchValue({
      query: 'test',
      categories: ['cat1']
    });
    
    component.onReset();
    
    expect(component.searchForm.get('query')?.value).toBe('');
    expect(component.searchForm.get('categories')?.value).toEqual([]);
  });

  it('should validate search criteria', () => {
    component.searchForm.patchValue({
      query: 'test query'
    });
    
    expect(component['shouldAutoSearch']()).toBe(true);
  });
});
