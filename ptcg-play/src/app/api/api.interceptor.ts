import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { ApiErrorEnum } from 'ptcg-server';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, timeout } from 'rxjs/operators';

import { ApiError } from './api.error';
import { AlertService } from '../shared/alert/alert.service';
import { Router } from '@angular/router';
import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService
  ) { }

  private async tokenAlert() {
    this.dialog.closeAll();
    if (this.sessionService.session.loggedUserId) {
      await this.alertService.alert(this.translate.instant('ERROR_SESSION_EXPIRED'));
      this.sessionService.clear();
      this.router.navigate(['/login']);
    }
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(environment.timeout),
      catchError(response => {
        const apiError = ApiError.fromError(response);

        if (apiError.timeout) {
          this.alertService.toast(this.translate.instant('ERROR_TIMEOUT'));
          apiError.handled = true;
        }

        if (!apiError.timeout && !apiError.code) {
          this.alertService.toast(this.translate.instant('ERROR_SERVER_CONNECT'));
          apiError.handled = true;
        }

        switch (apiError.code) {
          case ApiErrorEnum.AUTH_TOKEN_INVALID:
            apiError.handled = true;
            this.tokenAlert();
            break;
          case ApiErrorEnum.REQUESTS_LIMIT_REACHED:
            this.alertService.toast(this.translate.instant('ERROR_REQUESTS_LIMIT_REACHED'));
            apiError.handled = true;
            break;
          case ApiErrorEnum.VALIDATION_INVALID_PARAM:
            this.alertService.toast(this.translate.instant('ERROR_INVALID_REQUEST'));
            apiError.handled = true;
            break;
        }

        return throwError(apiError);
      })
    );
  }

}
