import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTree } from './category-tree';

describe('CategoryTree', () => {
  let component: CategoryTree;
  let fixture: ComponentFixture<CategoryTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
