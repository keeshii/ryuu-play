import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  exports: [
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule
  ]
})
export class MaterialModule {}
