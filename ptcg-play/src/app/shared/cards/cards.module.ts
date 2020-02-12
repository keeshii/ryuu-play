import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { DropHighlightDirective } from './drop-highlight/drop-highlight.directive';


@NgModule({
  imports: [
    CommonModule,
    SkyhookDndModule,
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
