import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { AlertService } from './alert.service';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { InputNumberPopupComponent } from './input-number-popup/input-number-popup.component';
import { InputNamePopupComponent } from './input-name-popup/input-name-popup.component';
import { MaterialModule } from '../material.module';
import { SelectPopupComponent } from './select-popup/select-popup.component';
import { ValidationModule } from '../validation/validation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
    ValidationModule
  ],
  declarations: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    InputNumberPopupComponent,
    InputNamePopupComponent,
    SelectPopupComponent
  ],
  entryComponents: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    InputNumberPopupComponent,
    InputNamePopupComponent,
    SelectPopupComponent
  ],
  providers: [
    AlertService
  ]
})
export class AlertModule { }
