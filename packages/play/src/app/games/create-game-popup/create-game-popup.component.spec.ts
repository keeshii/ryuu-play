import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { Format, Rules } from '@ptcg/common';

import { CreateGamePopupComponent } from './create-game-popup.component';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { DeckListEntry } from '../../api/interfaces/deck.interface';

describe('CreateGamePopupComponent', () => {
  let component: CreateGamePopupComponent;
  let fixture: ComponentFixture<CreateGamePopupComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateGamePopupComponent>>;
  let cardsBaseServiceSpy: jasmine.SpyObj<CardsBaseService>;

  const mockFormat1: Format = {
    name: 'format1',
    cards: [],
    rules: new Rules(),
    ranges: []
  };

  const mockFormat2: Format = {
    name: 'format2',
    cards: [],
    rules: new Rules(),
    ranges: []
  };

  const mockDecks: DeckListEntry[] = [
    { id: 1, name: 'Deck 1', formatNames: ['format1'], cardType: [], isValid: true },
    { id: 2, name: 'Deck 2', formatNames: ['format1', 'format2'], cardType: [], isValid: true },
    { id: 3, name: 'Deck 3', formatNames: ['format2'], cardType: [], isValid: true }
  ];

  beforeEach(waitForAsync(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    cardsBaseServiceSpy = jasmine.createSpyObj('CardsBaseService', ['getAllFormats']);
    cardsBaseServiceSpy.getAllFormats.and.returnValue([mockFormat1, mockFormat2]);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        TranslateModule.forRoot()
      ],
      declarations: [ CreateGamePopupComponent ],
      providers: [
        { provide: CardsBaseService, useValue: cardsBaseServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { decks: mockDecks } }
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

  it('should initialize with formats and decks', () => {
    expect(component.formats.length).toBe(3); // format1, format2, and all cards format
    expect(component.decks.length).toBe(2); // Only decks for format1 (initial format)
    expect(component.format).toBe(mockFormat1);
    expect(component.deck).toBe(mockDecks[0]);
  });

  it('should have correct time limit options', () => {
    expect(component.timeLimits.length).toBe(4);
    expect(component.timeLimits[0].value).toBe(0);
    expect(component.timeLimits[1].value).toBe(600);
    expect(component.timeLimits[2].value).toBe(1200);
    expect(component.timeLimits[3].value).toBe(1800);
  });

  describe('onFormatChange', () => {
    it('should update decks list when format changes', () => {
      component.onFormatChange(mockFormat2);
      expect(component.decks.length).toBe(2); // Decks for format2
      expect(component.format).toBe(mockFormat2);
      expect(component.deck).toBe(mockDecks[1]); // First deck that matches format2
    });

    it('should show all decks when selecting all cards format', () => {
      const allCardsFormat = component.formats[component.formats.length - 1];
      component.onFormatChange(allCardsFormat);
      expect(component.decks.length).toBe(mockDecks.length);
      expect(component.format.name).toBe('');
    });

    it('should update game settings rules when format changes', () => {
      const customRules = new Rules();
      const customFormat: Format = { ...mockFormat1, rules: customRules };
      
      component.onFormatChange(customFormat);
      expect(component.settings.rules).toEqual(new Rules({ ...customRules, formatName: customFormat.name }));
    });
  });

  describe('dialog actions', () => {
    it('should close dialog with result on confirm', () => {
      component.deck = mockDecks[0];
      component.format = mockFormat1;
      
      component.confirm();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        formatName: mockFormat1.name,
        deckId: mockDecks[0].id,
        gameSettings: component.settings
      });
    });

    it('should close dialog without result on cancel', () => {
      component.cancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  describe('format and deck selection', () => {
    it('should keep current deck if it matches new format', () => {
      component.deck = mockDecks[1]; // Deck that's valid in both formats
      component.onFormatChange(mockFormat2);
      expect(component.deck).toBe(mockDecks[1]);
    });

    it('should change deck if current deck doesnt match new format', () => {
      component.deck = mockDecks[0]; // Deck only valid in format1
      component.onFormatChange(mockFormat2);
      expect(component.deck).not.toBe(mockDecks[0]);
      expect(component.deck.formatNames).toContain(mockFormat2.name);
    });

    it('should keep current deck for all cards format', () => {
      component.deck = mockDecks[0];
      const allCardsFormat = component.formats[component.formats.length - 1];
      component.onFormatChange(allCardsFormat);
      expect(component.deck).toBe(mockDecks[0]);
    });
  });
});
