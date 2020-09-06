import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  // this url can be moved to environment variables
  url = 'https://api.raisely.com/v3/';

  constructor( private http: HttpClient ) { }

  HttpEventResponse(event) {
    switch ( event.type ) {
      case HttpEventType.Sent:
      break;
      case HttpEventType.ResponseHeader:
      break;
      case HttpEventType.DownloadProgress:
      const loaded = Math.round( event.loaded / 1024 );
      break;
      case HttpEventType.Response:
      return event.body;
    }
  }

  register(data: any) {
    const request = new HttpRequest('POST', this.url + 'signup', data, { reportProgress: true });
    return this.http.request(request);
  }

  checkEmail(data: any) {
    const request = new HttpRequest('POST', this.url + 'check-user', data, { reportProgress: true });
    return this.http.request(request);
  }
}
