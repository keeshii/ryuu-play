import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { TranslateModule } from '@ngx-translate/core';

import { CreateGamePopupComponent, CreateGamePopupData } from './create-game-popup.component';

describe('CreateGamePopupComponent', () => {
  let component: CreateGamePopupComponent;
  let fixture: ComponentFixture<CreateGamePopupComponent>;
  let data: CreateGamePopupData;

  beforeEach(waitForAsync(() => {
    data = { decks: [ { value: 1, viewValue: 'name' } ] };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        TranslateModule.forRoot()
      ],
      declarations: [ CreateGamePopupComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
