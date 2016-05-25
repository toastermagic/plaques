import { PlaquesPage } from './app.po';

describe('plaques App', function() {
  let page: PlaquesPage;

  beforeEach(() => {
    page = new PlaquesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('plaques works!');
  });
});
