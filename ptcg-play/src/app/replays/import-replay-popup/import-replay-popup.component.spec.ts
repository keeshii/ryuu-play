import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService } from '../../shared/session/session.service';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { FileInputComponent } from '../../shared/file-input/file-input.component';
import { ImportReplayPopupComponent } from './import-replay-popup.component';
import { ValidationModule } from '../../shared/validation/validation.module';

describe('ImportReplayPopupComponent', () => {
  let component: ImportReplayPopupComponent;
  let fixture: ComponentFixture<ImportReplayPopupComponent>;
  let sessionService: SessionService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        FormsModule,
        TranslateModule.forRoot(),
        ValidationModule
      ],
      declarations: [ FileInputComponent, ImportReplayPopupComponent ],
      providers: [ { provide: MatDialogRef, useValue: {} } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionService.set({ config: { avatarFileSize: 1000 } as any })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportReplayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
