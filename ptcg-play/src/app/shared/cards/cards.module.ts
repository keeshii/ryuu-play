import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';

import { CardComponent } from './card/card.component';
import { CardImagePopupComponent } from './card-image-popup/card-image-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneComponent } from './card-info-pane/card-info-pane.component';
import { CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardListPaneComponent } from './card-list-pane/card-list-pane.component';
import { CardListPopupComponent } from './card-list-popup/card-list-popup.component';
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
    CardImagePopupComponent,
    CardInfoPaneComponent,
    CardInfoPopupComponent,
    CardListPaneComponent,
    CardListPopupComponent,
    EnergyComponent,
    DropHighlightDirective,
    TrainerTypeComponent,
    HoverHighlightComponent,
    CardInfoListPopupComponent,
  ],
  entryComponents: [
    CardImagePopupComponent,
    CardInfoPopupComponent,
    CardInfoListPopupComponent,
    CardListPopupComponent
  ],
  exports: [
    CardComponent,
    EnergyComponent,
    DropHighlightDirective
  ]
})
export class CardsModule { }
