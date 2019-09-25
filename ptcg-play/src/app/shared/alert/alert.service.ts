import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AlertService {

  constructor() { }

  public error(message: string, title?: string) {
    console.log(message);
  }

  public toast(message: string, duration: number = 3000) {
    console.log(message);
  }

  public confirm(message: string, button?: string): Observable<void> {
    return new Observable<void>();
  }

}
