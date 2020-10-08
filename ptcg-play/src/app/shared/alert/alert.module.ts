import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { AlertService } from './alert.service';
import { CardsModule } from '../cards/cards.module';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { ImagePopupComponent } from './image-popup/image-popup.component';
import { InputNumberPopupComponent } from './input-number-popup/input-number-popup.component';
import { InputNamePopupComponent } from './input-name-popup/input-name-popup.component';
import { MaterialModule } from '../material.module';
import { SelectPopupComponent } from './select-popup/select-popup.component';
import { UserInfoModule } from '../user-info/user-info.module';
import { ValidationModule } from '../validation/validation.module';

@NgModule({
  imports: [
    CardsModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    UserInfoModule,
    ValidationModule
  ],
  declarations: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    ImagePopupComponent,
    InputNumberPopupComponent,
    InputNamePopupComponent,
    SelectPopupComponent
  ],
  entryComponents: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    ImagePopupComponent,
    InputNumberPopupComponent,
    InputNamePopupComponent,
    SelectPopupComponent
  ],
  providers: [
    AlertService
  ]
})
export class AlertModule { }
