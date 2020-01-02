import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  private buildUrl(uri: string) {
    return environment.apiUrl + uri;
  }

  private buildHeaderOptions() {
    const token = this.sessionService.session.authToken;
    return token
      ? { headers: { 'Auth-Token': token } }
      : undefined;
  }

  public get<T>(uri: string): Observable<T> {
    const url = this.buildUrl(uri);
    const options = this.buildHeaderOptions();

    return this.http.get<T>(url, options).pipe(share());
  }

  public post<T>(uri: string, body: any): Observable<T> {
    const url = this.buildUrl(uri);
    const options = this.buildHeaderOptions();

    return this.http.post<T>(url, body, options).pipe(share());
  }

}
