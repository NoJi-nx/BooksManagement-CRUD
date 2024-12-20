import { TestBed } from '@angular/core/testing';

import { DarklightThemeService } from './darklight-theme.service';

describe('DarklightThemeService', () => {
  let service: DarklightThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarklightThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
