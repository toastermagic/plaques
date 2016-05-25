import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { PlaquesAppComponent } from '../app/plaques.component';

beforeEachProviders(() => [PlaquesAppComponent]);

describe('App: Plaques', () => {
  it('should create the app',
      inject([PlaquesAppComponent], (app: PlaquesAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'plaques works!\'',
      inject([PlaquesAppComponent], (app: PlaquesAppComponent) => {
    expect(app.title).toEqual('plaques works!');
  }));
});
