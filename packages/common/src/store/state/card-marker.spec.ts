import { Marker } from './card-marker';
import { Card } from '../card/card';
import { SuperType } from '../card/card-types';
import { Effect } from '../effects/effect';
import { StoreLike } from '../store-like';
import { State } from './state';

class TestCard extends Card {
  id = 1;
  set = 'TEST';
  superType = SuperType.TRAINER;
  fullName = 'Test Card';
  name = 'Test';
  tags = [];

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}

describe('Marker', () => {
  let marker: Marker;
  let card1: Card;
  let card2: Card;

  beforeEach(() => {
    marker = new Marker();
    card1 = new TestCard();
    card1.id = 1;
    card2 = new TestCard();
    card2.id = 2;
  });

  describe('addMarker', () => {
    it('should add a new marker', () => {
      marker.addMarker('test', card1);
      expect(marker.markers.length).toBe(1);
      expect(marker.markers[0]).toEqual({ name: 'test', source: card1 });
    });

    it('should not add duplicate marker', () => {
      marker.addMarker('test', card1);
      marker.addMarker('test', card1);
      expect(marker.markers.length).toBe(1);
    });

    it('should add same marker name from different sources', () => {
      marker.addMarker('test', card1);
      marker.addMarker('test', card2);
      expect(marker.markers.length).toBe(2);
    });
  });

  describe('hasMarker', () => {
    beforeEach(() => {
      marker.addMarker('test1', card1);
      marker.addMarker('test2', card2);
    });

    it('should find marker by name only', () => {
      expect(marker.hasMarker('test1')).toBe(true);
      expect(marker.hasMarker('test2')).toBe(true);
      expect(marker.hasMarker('nonexistent')).toBe(false);
    });

    it('should find marker by name and source', () => {
      expect(marker.hasMarker('test1', card1)).toBe(true);
      expect(marker.hasMarker('test1', card2)).toBe(false);
      expect(marker.hasMarker('test2', card2)).toBe(true);
      expect(marker.hasMarker('test2', card1)).toBe(false);
    });
  });

  describe('removeMarker', () => {
    beforeEach(() => {
      marker.addMarker('test1', card1);
      marker.addMarker('test2', card1);
      marker.addMarker('test1', card2);
    });

    it('should remove all markers with given name', () => {
      marker.removeMarker('test1');
      expect(marker.markers.length).toBe(1);
      expect(marker.hasMarker('test1')).toBe(false);
      expect(marker.hasMarker('test2')).toBe(true);
    });

    it('should remove marker for specific source', () => {
      marker.removeMarker('test1', card1);
      expect(marker.markers.length).toBe(2);
      expect(marker.hasMarker('test1', card1)).toBe(false);
      expect(marker.hasMarker('test1', card2)).toBe(true);
      expect(marker.hasMarker('test2', card1)).toBe(true);
    });

    it('should do nothing if marker does not exist', () => {
      marker.removeMarker('nonexistent');
      expect(marker.markers.length).toBe(3);
    });

    it('should do nothing if marker does not exist for given source', () => {
      marker.removeMarker('test2', card2);
      expect(marker.markers.length).toBe(3);
    });
  });
});