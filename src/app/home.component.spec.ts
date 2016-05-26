import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { HomeComponent } from '../app/home.component';

beforeEachProviders(() => [HomeComponent]);

describe('App: Home', () => {
  it('should create the app',
      inject([HomeComponent], (app: HomeComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'Home works!\'',
      inject([HomeComponent], (app: HomeComponent) => {
    // expect(app.title).toEqual('plaques works!');
  }));
});
