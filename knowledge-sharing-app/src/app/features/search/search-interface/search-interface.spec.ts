import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInterface } from './search-interface';

describe('SearchInterface', () => {
  let component: SearchInterface;
  let fixture: ComponentFixture<SearchInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
