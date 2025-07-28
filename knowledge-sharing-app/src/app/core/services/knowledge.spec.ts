import { TestBed } from '@angular/core/testing';

import { Knowledge } from './knowledge';

describe('Knowledge', () => {
  let service: Knowledge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Knowledge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
