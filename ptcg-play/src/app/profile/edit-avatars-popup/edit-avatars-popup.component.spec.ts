import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

import { AlertModule } from '../../shared/alert/alert.module';
import { ApiModule } from '../../api/api.module';
import { EditAvatarsPopupComponent } from './edit-avatars-popup.component';

describe('EditAvatarsPopupComponent', () => {
  let component: EditAvatarsPopupComponent;
  let fixture: ComponentFixture<EditAvatarsPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AlertModule,
        ApiModule,
        MatTableModule,
        TranslateModule.forRoot()
      ],
      declarations: [ EditAvatarsPopupComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { userId: 1 } }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAvatarsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
