import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { switchMap, finalize } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { EditAvatarsPopupService } from './edit-avatars-popup/edit-avatars-popup.service';
import { ProfileService } from '../api/services/profile.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';


@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public user: UserInfo;
  public loggedUserId: number;
  public loading: boolean;
  public owner: boolean;

  constructor(
    private alertService: AlertService,
    private edtiAvatarsPopupService: EditAvatarsPopupService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const userId = parseInt(paramMap.get('userId'), 10);
        return this.profileService.getUser(userId);
      }),
      takeUntilDestroyed(this)
    )
      .subscribe({
        next: response => {
          this.loading = false;
          this.user = response.user;
          this.owner = this.isOwner(this.user, this.loggedUserId);
        },
        error: async error => {
          await this.alertService.error('Error while loading the profile');
          this.router.navigate(['/']);
        }
      });

    this.sessionService.get(session => session.loggedUserId)
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: loggedUserId => {
          this.loggedUserId = loggedUserId;
          this.owner = this.isOwner(this.user, this.loggedUserId);
        }
      });
  }

  inviteToPlay() {
    return;
  }

  editAvatars(user: UserInfo) {
    const dialog = this.edtiAvatarsPopupService.openDialog(user);
    dialog.afterClosed()
      .pipe(
        switchMap(() => {
          this.loading = true;
          return this.profileService.getUser(user.userId);
        }),
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.user = response.user;
          const users = { ...this.sessionService.session.users };
          users[response.user.userId] = response.user;
          this.sessionService.set({ users });
        }
      });
  }

  private isOwner(user: UserInfo, loggedUserId: number) {
    if (!user || !loggedUserId) {
      return false;
    }
    return user.userId === loggedUserId;
  }

  ngOnDestroy() {}

}
