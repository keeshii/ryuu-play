import { Player } from './player';
import { CardList } from './card-list';
import { PokemonSlot } from './pokemon-slot';
import { PokemonCard } from '../card/pokemon-card';
import { PlayerType, SlotType } from '../actions/play-card-action';

class TestPokemon extends PokemonCard {
  set = 'TEST';
  name = 'Test Pokemon';
  fullName = 'Test Pokemon TEST';
}

describe('Player', () => {
  let player: Player;
  let testPokemon: TestPokemon;

  beforeEach(() => {
    player = new Player();
    testPokemon = new TestPokemon();
  });

  it('should initialize with default values', () => {
    expect(player.id).toBe(0);
    expect(player.name).toBe('');
    expect(player.deck).toBeInstanceOf(CardList);
    expect(player.hand).toBeInstanceOf(CardList);
    expect(player.discard).toBeInstanceOf(CardList);
    expect(player.stadium).toBeInstanceOf(CardList);
    expect(player.supporter).toBeInstanceOf(CardList);
    expect(player.active).toBeInstanceOf(PokemonSlot);
    expect(player.bench).toEqual([]);
    expect(player.prizes).toEqual([]);
    expect(player.retreatedTurn).toBe(0);
    expect(player.energyPlayedTurn).toBe(0);
    expect(player.stadiumPlayedTurn).toBe(0);
    expect(player.stadiumUsedTurn).toBe(0);
    expect(player.avatarName).toBe('');
  });

  describe('getPrizeLeft', () => {
    it('should return 0 when no prizes', () => {
      expect(player.getPrizeLeft()).toBe(0);
    });

    it('should return correct number of prizes', () => {
      const prizeList1 = new CardList();
      const prizeList2 = new CardList();
      prizeList1.cards.push(testPokemon);
      prizeList2.cards.push(testPokemon, testPokemon);
      player.prizes = [prizeList1, prizeList2];

      expect(player.getPrizeLeft()).toBe(3);
    });
  });

  describe('forEachPokemon', () => {
    it('should handle empty board', () => {
      const handler = jasmine.createSpy('handler');
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle active pokemon only', () => {
      const handler = jasmine.createSpy('handler');
      player.active.pokemons.cards.push(testPokemon);
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, handler);
      
      expect(handler).toHaveBeenCalledWith(
        player.active,
        testPokemon,
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }
      );
    });

    it('should handle bench pokemon', () => {
      const handler = jasmine.createSpy('handler');
      const benchSlot = new PokemonSlot();
      benchSlot.pokemons.cards.push(testPokemon);
      player.bench.push(benchSlot);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, handler);

      expect(handler).toHaveBeenCalledWith(
        benchSlot,
        testPokemon,
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }
      );
    });

    it('should handle both active and bench pokemon', () => {
      const handler = jasmine.createSpy('handler');
      player.active.pokemons.cards.push(testPokemon);
      
      const benchSlot = new PokemonSlot();
      benchSlot.pokemons.cards.push(testPokemon);
      player.bench.push(benchSlot);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, handler);

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('switchPokemon', () => {
    it('should not switch with invalid target', () => {
      const invalidSlot = new PokemonSlot();
      player.active.pokemons.cards.push(testPokemon);
      
      player.switchPokemon(invalidSlot);
      
      expect(player.active.pokemons.cards).toContain(testPokemon);
    });

    it('should switch active with bench pokemon', () => {
      const activePokemon = new TestPokemon();
      const benchPokemon = new TestPokemon();
      
      player.active.pokemons.cards.push(activePokemon);
      const benchSlot = new PokemonSlot();
      benchSlot.pokemons.cards.push(benchPokemon);
      player.bench.push(benchSlot);

      player.switchPokemon(benchSlot);

      expect(player.active.pokemons.cards[0]).toBe(benchPokemon);
      expect(player.bench[0].pokemons.cards[0]).toBe(activePokemon);
    });

    it('should clear effects when switching', () => {
      const clearEffectsSpy = spyOn(player.active, 'clearEffects');
      
      const benchSlot = new PokemonSlot();
      benchSlot.pokemons.cards.push(testPokemon);
      player.bench.push(benchSlot);

      player.switchPokemon(benchSlot);

      expect(clearEffectsSpy).toHaveBeenCalledWith();
    });
  });
});
