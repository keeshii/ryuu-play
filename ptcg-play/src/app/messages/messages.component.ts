import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ConversationsResponse } from '../api/interfaces/message.interface';
import { MessageService } from '../api/services/message.service';
import { SessionService } from '../shared/session/session.service';
import { UserInfoMap } from '../shared/session/session.interface';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  public loading = false;
  public loadingMessages = false;

  public conversations$: Observable<ConversationInfo[]>;
  public userId = 0;
  public loggedUserId: number;

  constructor(
    private alertService: AlertService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.conversations$ = this.sessionService.get(session => session.conversations);
  }

  ngOnInit(): void {
    this.sessionService.get(session => session.loggedUserId).pipe(
      takeUntilDestroyed(this)
    ).subscribe({
      next: loggedUserId => this.loggedUserId = loggedUserId
    });

    this.conversations$.pipe(
      takeUntilDestroyed(this)
    ).subscribe({
      next: conversations => {
        if (this.userId === 0 && conversations.length > 0) {
          const c = conversations[0];
          let userId = c.user1Id;
          if (userId === this.loggedUserId) {
            userId = c.user2Id;
          }
          this.router.navigate(['/message', userId]);
        }
      }
    });

    this.route.paramMap.pipe(
      takeUntilDestroyed(this)
    )
    .subscribe({
      next: paramMap => {
        this.loggedUserId = this.sessionService.session.loggedUserId;
        const userId = parseInt(paramMap.get('userId') || '0', 10);
        this.userId = userId;
      }
    });

    this.loading = true;
    this.messageService.getConversations().pipe(
      takeUntilDestroyed(this),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        this.updateConversations(response);
      },
      error: async error => {
        await this.alertService.error('Error while loading the conversations.');
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
  }

  private updateConversations(response: ConversationsResponse) {
    const users = { ...this.sessionService.session.users };
    for (const user of response.users) {
      users[user.userId] = user;
    }

    const conversations = this.sessionService.session.conversations.slice();
    for (const c of response.conversations) {
      const index = conversations.findIndex(co => {
        return co.user1Id === c.user1Id && co.user2Id === c.user2Id;
      });
      if (index !== -1) {
        conversations[index] = c;
      } else {
        conversations.push(c);
      }
    }
    this.sessionService.set({ conversations, users });
  }

  public newConversation() {
    return;
  }

  public deleteConversation(userId: number) {
    return;
  }

}
