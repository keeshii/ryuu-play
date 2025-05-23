import { Component, DestroyRef, inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ApiError } from 'src/app/api/api.error';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiService } from '../../api/api.service';
import { LoginRememberService } from '../login-remember.service';
import { SocketService } from '../../api/socket.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ptcg-change-server-popup',
  templateUrl: './change-server-popup.component.html',
  styleUrls: ['./change-server-popup.component.scss']
})
export class ChangeServerPopupComponent {

  public value: string;
  public invalidValue: string;
  public loading = false;
  private destroyRef = inject(DestroyRef);

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

  public confirm(): void {
    const newApiUrl = this.value;

    this.loading = true;
    this.apiService.getServerInfo(newApiUrl).pipe(
      takeUntilDestroyed(this.destroyRef),
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
