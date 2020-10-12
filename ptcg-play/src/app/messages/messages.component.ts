import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { MessageService } from '../api/services/message.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  public loading = false;

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

    this.route.paramMap.pipe(
      takeUntilDestroyed(this)
    )
    .subscribe({
      next: paramMap => {
        this.loggedUserId = this.sessionService.session.loggedUserId;
        const userId = parseInt(paramMap.get('userId') || '0', 10);
        this.userId = userId;
        this.createOrUpdateConversation(this.loggedUserId, userId);
      }
    });

    this.conversations$.pipe(
      takeUntilDestroyed(this)
    ).subscribe({
      next: conversations => {
        const exists = this.sessionService.session.users[this.userId] !== undefined;
        if (!exists) {
          this.userId = 0;
        }
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

  }

  ngOnDestroy(): void {
  }

  private createOrUpdateConversation(user1Id: number, user2Id: number) {
    if (!user1Id || !user2Id) {
      return;
    }

    let conversations = this.sessionService.session.conversations;
    const index = conversations.findIndex(c => {
      return (c.user1Id === user1Id && c.user2Id === user2Id)
        || (c.user1Id === user2Id || c.user2Id === user1Id);
    });

    // If conversation exists, update message isRead as true
    if (index !== -1 && conversations[index].lastMessage.isRead === false) {
      const conversation = conversations[index];
      const lastMessage = { ...conversation.lastMessage, isRead: true };
      const newConversation = { ...conversation, lastMessage };
      conversations = conversations.slice();
      conversations[index] = newConversation;
      this.sessionService.set({ conversations });
    }

    const userExists = this.sessionService.session.users[user2Id] !== undefined;

    // If conversation does not exist, create new one.
    if (index === -1 && userExists) {
      const newConversation: ConversationInfo = {
        user1Id,
        user2Id,
        lastMessage: {
          messageId: 0,
          senderId: user1Id,
          created: Date.now(),
          text: '',
          isRead: true
        }
      };
      this.sessionService.set({
        conversations: [ newConversation, ...conversations ]
      });
    }

    // User does not exists
    if (index === -1 && !userExists) {
      // Redirect to the another conversation
      this.sessionService.set({ conversations: [ ...conversations ] });
    }
  }

  public async deleteConversation(userId: number) {
    if (userId === 0) {
      return;
    }

    if (!await this.alertService.confirm('Delete this conversation from your profile?')) {
      return;
    }

    this.loading = true;
    this.messageService.deleteMessages(userId).pipe(
      takeUntilDestroyed(this),
      finalize(() => { this.loading = false; })
    ).subscribe({
        next: () => {
          const conversations = this.sessionService.session.conversations
            .filter(c => c.user1Id !== userId && c.user2Id !== userId);
          this.sessionService.set({ conversations });
          if (this.userId === userId) {
            this.router.navigate(['/message']);
          }
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
        }
      });
  }

}
