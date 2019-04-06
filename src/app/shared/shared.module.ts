import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MaterialModule
  ],
  exports: [
    BrowserAnimationsModule,
    MaterialModule
  ]
})
export class SharedModule {}
