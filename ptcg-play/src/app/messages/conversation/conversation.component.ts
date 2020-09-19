import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageInfo } from 'ptcg-server';
import { finalize, skip } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { MessageService } from '../../api/services/message.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  @Input() userId: number;
  @Input() loggedUserId: number;

  public loading = false;
  public messages$ = new BehaviorSubject<MessageInfo[]>([]);
  public text: string;

  constructor(
    private alertService: AlertService,
    private elementRef: ElementRef<HTMLElement>,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadMessages(this.userId);

    this.messages$
      .pipe(skip(1), takeUntilDestroyed(this))
      .subscribe({
        next: () => this.scrollToBottom()
      });
  }

  ngOnDestroy(): void {
  }

  public sendMessage(userId: number, text: string) {
    if (text.length === 0) {
      return;
    }

    this.messageService.sendMessage(userId, text)
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: response => {
          console.log('send response', response);
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
        }
      });
  }

  private loadMessages(userId: number) {
    this.loading = true;
    this.messageService.getConversation(userId).pipe(
      takeUntilDestroyed(this),
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
