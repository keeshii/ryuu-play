import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo, ConversationInfo } from 'ptcg-server';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { MessageService } from '../api/services/message.service';
import { ProfileService } from '../api/services/profile.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

  public loading = false;
  public conversations$ = new BehaviorSubject<ConversationInfo[]>([]);
  public conversation$: Observable<ConversationInfo | undefined>;
  public user$: Observable<UserInfo | undefined>;
  public userId: number;

  constructor(
    private alertService: AlertService,
    private messageService: MessageService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.conversation$ = EMPTY;
    this.user$ = EMPTY;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        const userId = parseInt(paramMap.get('userId') || '0', 10);
        this.userId = userId;
        this.user$ = this.sessionService.get(session => session.users[userId]);

        const user = this.sessionService.session.users[userId];
        if (user !== undefined || userId === 0) {
          return EMPTY;
        }
        this.loading = true;
        return this.profileService.getUser(userId);
      }),
      takeUntilDestroyed(this),
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
          await this.alertService.error('Error while loading the profile');
          this.router.navigate(['/']);
        }
      });

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

  ngOnDestroy(): void {
  }

  public deleteMessages(userId: number) {
    return;
  }

  public sendMessage(userId: number, text: string) {
    console.log('send message', userId, text);
    return;
  }

}
