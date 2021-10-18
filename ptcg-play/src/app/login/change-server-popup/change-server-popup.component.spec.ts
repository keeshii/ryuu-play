import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { AlertModule } from '../../shared/alert/alert.module';
import { ChangeServerPopupComponent } from './change-server-popup.component';
import { ValidationModule } from '../../shared/validation/validation.module';

describe('ChangeServerPopupComponent', () => {
  let component: ChangeServerPopupComponent;
  let fixture: ComponentFixture<ChangeServerPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        AlertModule,
        FormsModule,
        TranslateModule.forRoot(),
        ValidationModule
      ],
      declarations: [ ChangeServerPopupComponent ],
      providers: [ { provide: MatDialogRef, useValue: {} } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeServerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
