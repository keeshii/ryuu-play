import { Component, Input, OnChanges } from '@angular/core';
import { MessageInfo, UserInfo } from 'ptcg-server';
import { Observable, EMPTY } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-message-entry',
  templateUrl: './message-entry.component.html',
  styleUrls: ['./message-entry.component.scss']
})
export class MessageEntryComponent implements OnChanges {

  @Input() message: MessageInfo;
  @Input() loggedUserId: number;
  public user$: Observable<UserInfo> = EMPTY;
  public writtenByMe: boolean;

  constructor(private sessionService: SessionService) { }

  ngOnChanges(): void {
    if (this.message && this.loggedUserId) {
      const senderId = this.message.senderId;
      this.writtenByMe = senderId === this.loggedUserId;
      this.user$ = this.sessionService.get(session => session.users[senderId]);
    }
  }

}
