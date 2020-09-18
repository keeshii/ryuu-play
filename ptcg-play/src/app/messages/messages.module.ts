import { NgModule } from '@angular/core';

import { MessagesComponent } from './messages.component';
import { SharedModule } from '../shared/shared.module';
import { MessageEntryComponent } from './message-entry/message-entry.component';
import { ContactComponent } from './contact/contact.component';
import { ConversationComponent } from './conversation/conversation.component';
import { SelectUserPopupComponent } from './select-user-popup/select-user-popup.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MessagesComponent,
    MessageEntryComponent,
    ContactComponent,
    ConversationComponent,
    SelectUserPopupComponent
  ]
})
export class MessagesModule { }
