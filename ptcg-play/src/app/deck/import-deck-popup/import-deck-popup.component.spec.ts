import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { FileInputComponent } from '../../shared/file-input/file-input.component';
import { ImportDeckPopupComponent } from './import-deck-popup.component';
import { SessionService } from '../../shared/session/session.service';

describe('ImportDeckPopupComponent', () => {
  let component: ImportDeckPopupComponent;
  let fixture: ComponentFixture<ImportDeckPopupComponent>;
  let sessionService: SessionService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [ FileInputComponent, ImportDeckPopupComponent ],
      providers: [ { provide: MatDialogRef, useValue: {} } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionService.set({ config: { avatarFileSize: 1000 } as any })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDeckPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
