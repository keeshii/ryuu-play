import { NgModule } from '@angular/core';

import { MessagesComponent } from './messages.component';
import { SharedModule } from '../shared/shared.module';
import { MessageEntryComponent } from './message-entry/message-entry.component';
import { ContactBarComponent } from './contact-bar/contact-bar.component';
import { ConversationComponent } from './conversation/conversation.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MessagesComponent,
    MessageEntryComponent,
    ContactBarComponent,
    ConversationComponent
  ]
})
export class MessagesModule { }
