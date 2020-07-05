import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';

import { CardComponent } from './card/card.component';
import { CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { DropHighlightDirective } from './drop-highlight/drop-highlight.directive';
import { EnergyComponent } from './energy/energy.component';
import { MaterialModule } from '../material.module';
import { TrainerTypeComponent } from './trainer-type/trainer-type.component';
import { HoverHighlightComponent } from './hover-highlight/hover-highlight.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SkyhookDndModule,
    SkyhookMultiBackendModule,
  ],
  declarations: [
    CardComponent,
    CardInfoPopupComponent,
    EnergyComponent,
    DropHighlightDirective,
    TrainerTypeComponent,
    HoverHighlightComponent,
  ],
  entryComponents: [
    CardInfoPopupComponent
  ],
  exports: [
    CardComponent,
    EnergyComponent,
    DropHighlightDirective
  ]
})
export class CardsModule { }
