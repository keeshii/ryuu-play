import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageInfo } from 'ptcg-server';
import { finalize } from 'rxjs/operators';

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

  @Output() loading = new EventEmitter<boolean>();
  @Input() userId: number;
  @Input() loggedUserId: number;

  public messages$ = new BehaviorSubject<MessageInfo[]>([]);
  public text: string;

  constructor(
    private alertService: AlertService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadMessages(this.userId);
  }

  ngOnDestroy(): void {
  }

  public sendMessage(userId: number, text: string) {
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
    this.loading.next(true);
    this.messageService.getConversation(userId).pipe(
      takeUntilDestroyed(this),
      finalize(() => { this.loading.next(false); })
    ).subscribe({
      next: response => {
        this.messages$.next(response.messages);
      },
      error: (error: ApiError) => {
        this.alertService.toast(error.message);
      }
    });
  }

}
