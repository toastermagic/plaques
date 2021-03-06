import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class PlaqueService {
  constructor(private http: Http) {}

  prefix: string = API_URL_PREFIX;

  listPlaques() {
    var url = this.prefix + '/api/plaque/list/';
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  tags() {
    var url = this.prefix + '/api/plaque/tags/';
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  tweets(subject, location) {
    var codedSubject = encodeURI(subject);
    var codedLocation = encodeURI(JSON.stringify(location));
    var url = this.prefix + '/api/plaque/tweets/' +
                            '?subject=' + codedSubject + '&location=' + codedLocation;

    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  tweet(tweetId) {
    var url = this.prefix + '/api/plaque/tweet/' + tweetId;

    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  getPlaques(searchTerm) {
    var url = this.prefix + '/api/plaque/search/' + searchTerm;
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  getPlaque(plaqueId) {
    var url = this.prefix + '/api/plaque/show/' + plaqueId;
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }

  private handleError(error: Error) {
    // in a real world app, we may send the error to some remote logging
    // infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.message || 'Server error');
  }
}
