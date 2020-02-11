import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { SkyhookDndModule } from '@angular-skyhook/core';


@NgModule({
  imports: [
    CommonModule,
    SkyhookDndModule,
  ],
  declarations: [
    CardComponent
  ],
  exports: [
    CardComponent
  ]
})
export class CardsModule { }
