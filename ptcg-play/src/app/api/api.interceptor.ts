import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { ApiError, ApiErrorEnum } from './api.error';
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
  ) { }

  private async tokenAlert() {
    this.dialog.closeAll();
    await this.alertService.alert('Session expired.');
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(environment.timeout),
      catchError(response => {
        const apiError = ApiError.fromError(response);

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
