import { Component, OnInit, Input, ElementRef, OnChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subject, EMPTY } from 'rxjs';
import { MessageInfo, ConversationInfo } from 'ptcg-server';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, skip, takeUntil } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { MessageService } from '../../api/services/message.service';
import { SessionService } from '../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnChanges {

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
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.lastMessage$ = EMPTY;
  }

  ngOnInit(): void {
    this.userChanged$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.loadMessages(this.userId);
        this.observeLastMessage();
      });

    this.messages$
      .pipe(skip(1), untilDestroyed(this))
      .subscribe({
        next: messages => {
          this.scrollToBottom();

          // there are some messages marked as not read.
          if (messages.some(m => m.senderId === this.userId && !m.isRead)) {
            this.markAsRead(this.userId);
          }
        }
      });

    this.loadMessages(this.userId);
    this.observeLastMessage();
  }

  ngOnChanges(): void {
    if (this.userId && this.loggedUserId) {
      const userId = this.userId;

      this.lastMessage$ = this.sessionService.get(session => {
        const conversation = session.conversations.find(c => {
          return (c.user1Id === userId && c.user2Id === this.loggedUserId)
            || (c.user1Id === this.loggedUserId && c.user2Id === userId);
        });
        return conversation && conversation.lastMessage;
      });

      this.messages$.next([]);
      this.userChanged$.next();
    }
  }

  public sendMessage(userId: number, text: string) {
    text = (text || '').trim();
    if (text.length === 0 || this.loading) {
      return;
    }
    this.loading = true;
    this.messageService.sendMessage(userId, text).pipe(
      untilDestroyed(this),
      takeUntil(this.userChanged$),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        this.text = '';
        this.updateConversation({ lastMessage: response.message });
      },
      error: (error: ApiError) => {
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    });
  }

  private observeLastMessage() {
    this.lastMessage$.pipe(
      untilDestroyed(this),
      takeUntil(this.userChanged$)
    ).subscribe({
      next: message => {
        // ignore empty last message when user is starting a new conversation
        if (message === undefined || message.messageId === 0) {
          return;
        }
        let messages = this.messages$.value;
        const index = messages.findIndex(m => m.messageId === message.messageId);
        if (index === -1) {
          messages = [...messages, message];
          this.messages$.next(messages);
        } else if (message.senderId === this.loggedUserId) {
          messages = messages.slice();
          messages[index] = message;
          this.messages$.next(messages);
        }
      }
    });
  }

  private markAsRead(senderId: number): void {
    let messages = this.messages$.value;

    // Instantly update converstaion's isRead flag,
    // this way the new message badge won't blink
    let lastMessage = messages[messages.length - 1];
    if (lastMessage.senderId === senderId) {
      lastMessage = { ...lastMessage, isRead: true };
      this.updateConversation({ lastMessage });
    }

    this.messageService.readMessages(senderId).pipe(
      untilDestroyed(this),
      takeUntil(this.userChanged$)
    ).subscribe({
      next: () => {
        messages = this.messages$.value.slice();
        messages
          .filter(m => m.senderId === senderId)
          .forEach(m => { m.isRead = true; });
        this.messages$.next(messages);
      },
      error: (error: ApiError) => {
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    });
  }

  private loadMessages(userId: number): void {
    this.loading = true;
    this.messageService.getConversation(userId).pipe(
      untilDestroyed(this),
      takeUntil(this.userChanged$),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        const messages = response.messages.reverse();
        this.messages$.next(messages);
      },
      error: (error: ApiError) => {
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    });
  }

  private updateConversation(data: Partial<ConversationInfo>): void {
    const sessionConversations = this.sessionService.session.conversations;
    const userId = this.userId;
    const index = sessionConversations.findIndex(c => {
      return (c.user1Id === userId && c.user2Id === this.loggedUserId)
        || (c.user1Id === this.loggedUserId && c.user2Id === userId);
    });
    if (index !== -1) {
      const conversation = { ...sessionConversations[index], ...data };
      const conversations = sessionConversations.slice();
      conversations.splice(index, 1);
      conversations.unshift(conversation);
      this.sessionService.set({ conversations });
    }
  }

  private scrollToBottom(): void {
    try {
      const scollablePane = this.elementRef.nativeElement
        .getElementsByClassName('ptcg-content-container')[0] as HTMLElement;
      setTimeout(() => {
        scollablePane.scrollTop = scollablePane.scrollHeight;
      });
    } catch (err) { }
  }

}
