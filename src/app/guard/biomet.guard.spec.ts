import { TestBed } from '@angular/core/testing';

import { BiometGuard } from './biomet.guard';

describe('BiometGuard', () => {
  let guard: BiometGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BiometGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
