import { Card } from './card';
import { SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

class TestCard extends Card {
  set = 'TEST';
  superType = SuperType.POKEMON;
  fullName = 'Test Card';
  name = 'Test';
}

describe('Card', () => {
  let card: TestCard;
  let mockStore: jasmine.SpyObj<StoreLike>;
  let mockState: State;

  beforeEach(() => {
    card = new TestCard();
    mockStore = jasmine.createSpyObj('StoreLike', ['reduceEffect']);
    mockState = new State();
  });

  it('should initialize with default values', () => {
    expect(card.id).toBe(-1);
    expect(card.tags).toEqual([]);
  });

  it('should have correct abstract properties set', () => {
    expect(card.set).toBe('TEST');
    expect(card.superType).toBe(SuperType.POKEMON);
    expect(card.fullName).toBe('Test Card');
    expect(card.name).toBe('Test');
  });

  it('should return state unchanged in default reduceEffect', () => {
    const effect: Effect = { 
      type: 'TEST_EFFECT',
      preventDefault: false
    };
    const result = card.reduceEffect(mockStore, mockState, effect);
    expect(result).toBe(mockState);
  });

  it('should allow setting tags', () => {
    card.tags = ['tag1', 'tag2'];
    expect(card.tags).toEqual(['tag1', 'tag2']);
  });

  it('should allow setting id', () => {
    card.id = 123;
    expect(card.id).toBe(123);
  });
});