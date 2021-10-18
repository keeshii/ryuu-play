import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AddAvatarPopupComponent } from './add-avatar-popup.component';
import { AlertModule } from '../../shared/alert/alert.module';
import { ApiModule } from '../../api/api.module';
import { FileInputComponent } from '../../shared/file-input/file-input.component';
import { SessionService } from '../../shared/session/session.service';
import { ValidationModule } from '../../shared/validation/validation.module';

describe('AddAvatarPopupComponent', () => {
  let component: AddAvatarPopupComponent;
  let fixture: ComponentFixture<AddAvatarPopupComponent>;
  let sessionService: SessionService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        AlertModule,
        FormsModule,
        TranslateModule.forRoot(),
        ValidationModule
      ],
      declarations: [ AddAvatarPopupComponent, FileInputComponent ],
      providers: [ { provide: MatDialogRef, useValue: {} } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionService.set({ config: { avatarFileSize: 1000 } as any })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAvatarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
