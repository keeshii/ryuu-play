import { ActivatedRoute, Router } from '@angular/router';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserInfo } from '@ptcg/common';
import { Observable, EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ProfileService } from '../api/services/profile.service';
import { SessionService } from '../shared/session/session.service';
import { ProfilePopupService } from './profile-popup.service';

@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<UserInfo | undefined>;
  public loggedUserId: number;
  public loading: boolean;
  public userId: number;
  public owner$: Observable<boolean>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private profilePopupService: ProfilePopupService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.user$ = EMPTY;
    this.owner$ = EMPTY;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        const userId = parseInt(paramMap.get('userId'), 10);
        this.userId = userId;
        this.owner$ = this.sessionService.get(session => session.loggedUserId === userId);
        this.user$ = this.sessionService.get(session => session.users[userId]);

        const user = this.sessionService.session.users[userId];
        if (user !== undefined) {
          return EMPTY;
        }
        this.loading = true;
        return this.profileService.getUser(userId);
      }),
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe({
        next: response => {
          const user = response.user;
          const users = { ...this.sessionService.session.users };
          users[user.userId] = user;
          this.sessionService.set({ users });
          this.loading = false;
        },
        error: async error => {
          await this.alertService.error(this.translate.instant('PROFILE_LOADING_ERROR'));
          this.router.navigate(['/']);
        }
      });
  }

  changePassword() {
    this.profilePopupService.openChangePasswordPopup();
  }

  editAvatars(userId: number) {
    this.profilePopupService.openEditAvatarsPopup(userId);
  }

  changeEmail(userId: number) {
    this.profilePopupService.openChangeEmailPopup(userId);
  }

}
