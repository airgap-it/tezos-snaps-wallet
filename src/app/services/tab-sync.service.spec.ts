import { TestBed } from '@angular/core/testing';

import { TabSyncService } from './tab-sync.service';

describe('TabSyncService', () => {
  let service: TabSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
