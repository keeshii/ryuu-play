import { Component, Input, OnChanges } from '@angular/core';
import { ConversationInfo, UserInfo } from 'ptcg-server';
import { Observable, EMPTY } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-contact-bar',
  templateUrl: './contact-bar.component.html',
  styleUrls: ['./contact-bar.component.scss']
})
export class ContactBarComponent implements OnChanges {

  @Input() conversation: ConversationInfo;

  @Input() loggedUserId: number;

  @Input() active = false;

  public user$: Observable<UserInfo> = EMPTY;

  public marked: boolean;

  constructor(private sessionService: SessionService) { }

  ngOnChanges(): void {
    if (this.conversation && this.loggedUserId) {
      let userId = this.conversation.user1Id;
      if (userId === this.loggedUserId) {
        userId = this.conversation.user2Id;
      }
      const sendedByMe = this.conversation.lastMessage.senderId === this.loggedUserId;
      const isRead = this.conversation.lastMessage.isRead;
      this.marked = !sendedByMe && !isRead;
      this.user$ = this.sessionService.get(session => session.users[userId]);
    }
  }

}
