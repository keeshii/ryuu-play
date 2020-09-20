import { Component, OnInit, Input, OnDestroy, ElementRef, OnChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subject, EMPTY } from 'rxjs';
import { MessageInfo, ConversationInfo } from 'ptcg-server';
import { finalize, skip, takeUntil } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { MessageService } from '../../api/services/message.service';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() userId: number;
  @Input() loggedUserId: number;

  public loading = false;
  public messages$ = new BehaviorSubject<MessageInfo[]>([]);
  public lastMessage$: Observable<MessageInfo | undefined>;
  public text: string;
  private userChanged$ = new Subject<void>();

  constructor(
    private alertService: AlertService,
    private elementRef: ElementRef<HTMLElement>,
    private messageService: MessageService,
    private sessionService: SessionService
  ) {
    this.lastMessage$ = EMPTY;
  }

  ngOnInit(): void {
    this.userChanged$
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => {
        this.loadMessages(this.userId);
        this.observeLastMessage();
      });

    this.messages$
      .pipe(skip(1), takeUntilDestroyed(this))
      .subscribe({
        next: () => this.scrollToBottom()
      });

    this.loadMessages(this.userId);
    this.observeLastMessage();
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(): void {
    if (this.userId && this.loggedUserId) {
      const userId = this.userId;

      this.lastMessage$ = this.sessionService.get(session => {
        const conversation = session.conversations.find(c => {
          return (c.user1Id === userId && c.user2Id === this.loggedUserId)
            || (c.user1Id === this.loggedUserId || c.user2Id === userId);
        });
        return conversation && conversation.lastMessage;
      });

      this.messages$.next([]);
      this.userChanged$.next();
    }
  }

  public sendMessage(userId: number, text: string) {
    if (text.length === 0 || this.loading) {
      return;
    }
    this.loading = true;
    this.messageService.sendMessage(userId, text).pipe(
      takeUntilDestroyed(this),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        this.text = '';
        const conversations = this.sessionService.session.conversations;
        const index = conversations.findIndex(c => {
          return (c.user1Id === userId && c.user2Id === this.loggedUserId)
            || (c.user1Id === this.loggedUserId || c.user2Id === userId);
        });
        if (index !== -1) {
          const conversation = { ...conversations[index], lastMessage: response.message };
          const newConversations = conversations.slice();
          newConversations.splice(index, 1);
          newConversations.unshift(conversation);
          this.sessionService.set({ conversations: newConversations });
        }
      },
      error: (error: ApiError) => {
        this.alertService.toast(error.message);
      }
    });
  }

  private observeLastMessage() {
    this.lastMessage$.pipe(
      takeUntilDestroyed(this),
      takeUntil(this.userChanged$)
    ).subscribe({
      next: message => {
        if (message === undefined) {
          return;
        }
        let messages = this.messages$.value;
        const index = messages.findIndex(m => m.messageId === message.messageId);
        if (index === -1) {
          this.messages$.next([...messages, message]);
          return;
        }
        messages = messages.slice();
        messages[index] = message;
        this.messages$.next(messages);
      }
    });
  }

  private loadMessages(userId: number) {
    this.loading = true;
    this.messageService.getConversation(userId).pipe(
      takeUntilDestroyed(this),
      takeUntil(this.userChanged$),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        const messages = response.messages.reverse();
        this.messages$.next(messages);
      },
      error: (error: ApiError) => {
        this.alertService.toast(error.message);
      }
    });
  }

  private scrollToBottom(): void {
    try {
      const scollablePane = this.elementRef.nativeElement
        .getElementsByClassName('ptcg-conversation-content')[0] as HTMLElement;
      setTimeout(() => {
        scollablePane.scrollTop = scollablePane.scrollHeight;
      });
    } catch (err) { }
  }

}
