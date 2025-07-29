import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { SearchResultsComponent } from './search-results';
import { SearchService } from '../../../core/services/search.service';
import { signal } from '@angular/core';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let mockSearchService: jasmine.SpyObj<SearchService>;

  const mockSearchResults = {
    articles: [
      {
        id: '1',
        title: 'Test Article',
        content: 'This is a test article content',
        excerpt: 'Test excerpt',
        categoryId: 'cat1',
        authorId: 'author1',
        tags: ['test', 'article'],
        isPublished: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        imageUrl: 'https://example.com/image.jpg',
        thumbnailUrl: 'https://example.com/thumb.jpg'
      }
    ],
    totalCount: 1,
    queryTime: 150,
    suggestions: []
  };

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['search'], {
      results: signal(mockSearchResults),
      loading: signal(false),
      hasResults: signal(true),
      hasQuery: signal(true),
      resultSummary: signal('Found 1 result for "test" (150ms)'),
      currentQuery: signal('test')
    });

    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent, NoopAnimationsModule],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            params: { subscribe: () => {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    mockSearchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display search results', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.article-title')?.textContent).toContain('Test Article');
  });

  it('should handle image error gracefully', () => {
    const article = mockSearchResults.articles[0];
    const event = { target: { src: '' } };
    
    component.onImageError(event, article);
    
    expect(event.target.src).toBeTruthy();
    expect(event.target.src).toContain('placeholder');
  });

  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    const formatted = component.formatDate(date);
    expect(formatted).toBe('Jan 1, 2024');
  });

  it('should calculate reading time', () => {
    const content = 'This is a test content with exactly twenty words to test the reading time calculation function properly works.';
    const readingTime = component.getReadingTime(content);
    expect(readingTime).toBe(1); // Should be 1 minute for ~20 words
  });

  it('should get article preview without HTML', () => {
    const content = '<p>This is <strong>HTML</strong> content</p>';
    const preview = component.getArticlePreview(content);
    expect(preview).toBe('This is HTML content');
  });

  it('should highlight search terms', () => {
    const text = 'This is a test text';
    const highlighted = component.highlightSearchTerm(text, 'test');
    expect(highlighted).toBe('This is a <mark>test</mark> text');
  });

  it('should handle pagination correctly', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5, length: 20 };
    component.onPageChange(pageEvent);
    
    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(5);
  });
});
