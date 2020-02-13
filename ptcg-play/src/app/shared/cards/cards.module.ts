import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';

import { CardComponent } from './card/card.component';
import { DropHighlightDirective } from './drop-highlight/drop-highlight.directive';

@NgModule({
  imports: [
    CommonModule,
    SkyhookDndModule,
    SkyhookMultiBackendModule,
  ],
  declarations: [
    CardComponent,
    DropHighlightDirective
  ],
  exports: [
    CardComponent,
    DropHighlightDirective
  ]
})
export class CardsModule { }
