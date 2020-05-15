import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';

import { FtpsServerService } from './ftps-server.service';

describe('FtpsServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: FtpsServerService = TestBed.get(FtpsServerService);
    expect(service).toBeTruthy();
  });
});
