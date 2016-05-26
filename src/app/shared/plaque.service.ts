import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class PlaqueService {

  constructor(private http: Http) { }

  listPlaques() {
    var url = '/api/plaque/list/';
    // console.log('Sending request', url);
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  tags() {
    var url = '/api/plaque/tags/';
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  getPlaques(searchTerm) {
    var url = '/api/plaque/search/' + searchTerm;
    return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  }
  getPlaque(plaqueId) {
    var url = '/api/plaque/show/' + plaqueId;
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
