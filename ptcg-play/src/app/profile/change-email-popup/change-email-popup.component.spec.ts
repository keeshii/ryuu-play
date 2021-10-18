import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AlertModule } from '../../shared/alert/alert.module';
import { ApiModule } from '../../api/api.module';
import { ChangeEmailPopupComponent } from './change-email-popup.component';
import { ValidationModule } from '../../shared/validation/validation.module';

describe('ChangeEmailPopupComponent', () => {
  let component: ChangeEmailPopupComponent;
  let fixture: ComponentFixture<ChangeEmailPopupComponent>;

  beforeEach(waitForAsync(() => {        
    TestBed.configureTestingModule({
      imports: [
        AlertModule,
        ApiModule,
        FormsModule,
        TranslateModule.forRoot(),
        ValidationModule
      ],
      declarations: [ ChangeEmailPopupComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { userId: 1 } }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
