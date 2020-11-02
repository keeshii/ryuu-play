import { ApiErrorEnum } from 'ptcg-server';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { ApiError } from 'src/app/api/api.error';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiService } from '../../api/api.service';
import { LoginRememberService } from '../login-remember.service';
import { SocketService } from '../../api/socket.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ptcg-change-server-popup',
  templateUrl: './change-server-popup.component.html',
  styleUrls: ['./change-server-popup.component.scss']
})
export class ChangeServerPopupComponent implements OnInit, OnDestroy {

  public value: string;
  public invalidValue: string;
  public loading = false;

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ChangeServerPopupComponent>,
    private loginRememberService: LoginRememberService,
    private socketService: SocketService,
    private translate: TranslateService
  ) {
    this.value = this.apiService.getApiUrl();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public confirm(): void {
    const newApiUrl = this.value;

    this.loading = true;
    this.apiService.getServerInfo(newApiUrl).pipe(
      takeUntilDestroyed(this),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        if (response.config.apiVersion > environment.apiVersion) {
          this.alertService.toast(this.translate.instant('ERROR_UNSUPPORTED_VERSION'));
          this.invalidValue = newApiUrl;
          return;
        }

        const rememberApiUrl = newApiUrl !== environment.apiUrl ? newApiUrl : undefined;
        this.loginRememberService.rememberApiUrl(rememberApiUrl);

        this.alertService.toast(this.translate.instant('LOGIN_CHANGE_SERVER_SUCCESS'));
        this.apiService.setApiUrl(newApiUrl);
        this.socketService.setServerUrl(newApiUrl);
        this.dialogRef.close();
      },
      error: (error: ApiError) => {
        this.invalidValue = newApiUrl;
      }
    });
  }

}
