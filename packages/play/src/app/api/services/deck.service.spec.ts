import { TestBed } from '@angular/core/testing';
import { DeckService } from './deck.service';
import { ApiService } from '../api.service';

describe('DeckService', () => {
  let service: DeckService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        DeckService,
        { provide: ApiService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(DeckService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getList', () => {
    it('should get deck list', () => {
      service.getList();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/v1/decks/list');
    });
  });

  describe('getDeck', () => {
    it('should get deck by id', () => {
      const deckId = 123;

      service.getDeck(deckId);

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/v1/decks/get/123');
    });
  });

  describe('createDeck', () => {
    it('should create a new deck', () => {
      const deckName = 'New Deck';

      service.createDeck(deckName);

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/decks/save', { name: deckName, cards: [] });
    });
  });

  describe('saveDeck', () => {
    it('should save deck data', () => {
      const deckId = 456;
      const name = 'Updated Deck';
      const cards = ['card1', 'card2'];

      service.saveDeck(deckId, name, cards);

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/decks/save', { id: deckId, name, cards });
    });
  });

  describe('deleteDeck', () => {
    it('should delete the deck', () => {
      const deckId = 789;

      service.deleteDeck(deckId);

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/decks/delete', { id: deckId });
    });
  });

  describe('rename', () => {
    it('should rename the deck', () => {
      const deckId = 101;
      const name = 'Renamed Deck';

      service.rename(deckId, name);

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/decks/rename', { id: deckId, name });
    });
  });

  describe('duplicate', () => {
    it('should duplicate the deck', () => {
      const deckId = 202;
      const name = 'Duplicated Deck';

      service.duplicate(deckId, name);

      expect(apiServiceSpy.post).toHaveBeenCalledWith('/v1/decks/duplicate', { id: deckId, name });
    });
  });
});
