import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { CardInfoPopupComponent, CardInfoPopupData } from './card-info-popup.component';

describe('CardInfoPopupComponent', () => {
  let component: CardInfoPopupComponent;
  let fixture: ComponentFixture<CardInfoPopupComponent>;
  let data: CardInfoPopupData;

  beforeEach(waitForAsync(() => {
    data = { card: {} as any };

    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      declarations: [ CardInfoPopupComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
