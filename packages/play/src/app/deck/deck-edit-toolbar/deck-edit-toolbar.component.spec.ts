import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { DeckEditToolbarComponent } from './deck-edit-toolbar.component';

describe('DeckEditToolbarComponent', () => {
  let component: DeckEditToolbarComponent;
  let fixture: ComponentFixture<DeckEditToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: CardsBaseService, useValue: { getAllFormats: () => [] } }
      ],
      declarations: [ DeckEditToolbarComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckEditToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
