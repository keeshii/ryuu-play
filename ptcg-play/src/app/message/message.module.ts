import { NgModule } from '@angular/core';

import { MessageComponent } from './message.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MessageComponent
  ]
})
export class MessageModule { }
