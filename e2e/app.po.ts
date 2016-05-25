export class PlaquesPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('plaques-app h1')).getText();
  }
}
