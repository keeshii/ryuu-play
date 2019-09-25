import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { ApiError, ApiErrorEnum } from './api.error';
import { AlertService } from '../shared/alert/alert.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private alertService: AlertService,
  ) { }

  private tokenAlert() {
    /*const alert = this.alertCtrl.create({
      title: this.translate.instant('API_ERROR_AUTH_TITLE'),
      subTitle: this.translate.instant('API_ERROR_AUTH_SUBTITLE'),
        buttons: [{
          text: this.translate.instant('LABEL_IGNORE'),
          role: 'cancel'
        }, {
          text: this.translate.instant('LABEL_LOGOUT'),
          handler: () => {
            SessionSubject.clearAll();
          }
        }]
    });
    alert.present();*/
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(environment.timeout),
      catchError(response => {
        const apiError = new ApiError(response);

        if (apiError.timeout) {
          this.alertService.toast('API_ERROR_TIMEOUT');
        }

        if (!apiError.timeout && !apiError.code) {
          this.alertService.toast('API_ERROR_CONNECT');
        }

        switch (apiError.code) {
          case ApiErrorEnum.ERROR_BAD_TOKEN:
            this.tokenAlert();
            break;
          case ApiErrorEnum.ERROR_REQUESTS_LIMIT_REACHED:
            this.alertService.toast('API_ERROR_REQUEST_LIMIT');
            break;
          case ApiErrorEnum.ERROR_UNKNOWN_REQUEST:
            this.alertService.toast('API_ERROR_UNKNOWN');
            break;
        }

        return throwError(apiError);
      })
    );
  }

}
