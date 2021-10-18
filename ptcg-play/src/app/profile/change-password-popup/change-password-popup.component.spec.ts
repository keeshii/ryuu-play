import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { ChangePasswordPopupComponent } from './change-password-popup.component';
import { ValidationModule } from '../../shared/validation/validation.module';

describe('ChangePasswordPopupComponent', () => {
  let component: ChangePasswordPopupComponent;
  let fixture: ComponentFixture<ChangePasswordPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        FormsModule,
        TranslateModule.forRoot(),
        ValidationModule
      ],
      declarations: [ ChangePasswordPopupComponent ],
      providers: [ { provide: MatDialogRef, useValue: {} } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
