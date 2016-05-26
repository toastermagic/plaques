import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { PlaqueService } from './plaque.service';

describe('Plaque Service', () => {
  beforeEachProviders(() => [PlaqueService]);

  it('should ...',
      inject([PlaqueService], (service: PlaqueService) => {
    expect(service).toBeTruthy();
  }));
});
