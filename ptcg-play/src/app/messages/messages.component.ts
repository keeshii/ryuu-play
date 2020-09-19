import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationInfo } from 'ptcg-server';
import { Observable } from 'rxjs';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { MessageService } from '../api/services/message.service';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';
import {finalize} from 'rxjs/operators';

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
  }

  ngOnDestroy(): void {
  }

  public newConversation() {
    return;
  }

  public deleteConversation(userId: number) {
    if (userId === 0) {
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
