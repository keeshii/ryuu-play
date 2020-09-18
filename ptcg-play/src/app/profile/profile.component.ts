import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { Observable, EMPTY, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { EditAvatarsPopupService } from './edit-avatars-popup/edit-avatars-popup.service';
import { ProfileService } from '../api/services/profile.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

import { MessageService } from '../api/services/message.service';


@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public user$: Observable<UserInfo | undefined>;
  public loggedUserId: number;
  public loading: boolean;
  public userId: number;
  public owner$: Observable<boolean>;

  constructor(
    private alertService: AlertService,
    private edtiAvatarsPopupService: EditAvatarsPopupService,
    private messageService: MessageService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
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
      takeUntilDestroyed(this)
    )
      .subscribe({
        next: response => {
          const user = response.user;
          const users = { ...this.sessionService.session.users };
          users[user.userId] = user;
          this.sessionService.set({ users });
        },
        error: async error => {
          await this.alertService.error('Error while loading the profile');
          this.router.navigate(['/']);
        }
      });
  }

  inviteToPlay() {
    return;
  }

  sendMessage() {
    this.messageService.getConversations()
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: async error => {
          await this.alertService.toast(error);
        }
      });
  }

  editAvatars(userId: number) {
    this.edtiAvatarsPopupService.openDialog(userId);
  }

  ngOnDestroy() {}

}
