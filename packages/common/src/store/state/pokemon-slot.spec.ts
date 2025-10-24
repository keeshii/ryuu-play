import { PokemonSlot } from './pokemon-slot';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { SpecialCondition, Stage, TrainerType } from '../card/card-types';

class TestPokemon extends PokemonCard {
  set = 'TEST';
  name = 'Test Pokemon';
  fullName = 'Test Pokemon TEST';
  stage = Stage.BASIC;
}

class TestTool extends TrainerCard {
  set = 'TEST';
  name = 'Test Tool';
  fullName = 'Test Tool TEST';
  trainerType = TrainerType.TOOL;
}

class TestItem extends TrainerCard {
  set = 'TEST';
  name = 'Test Item';
  fullName = 'Test Item TEST';
  trainerType = TrainerType.ITEM;
}

describe('PokemonSlot', () => {
  let slot: PokemonSlot;
  let pokemon: TestPokemon;
  let tool: TestTool;
  let item: TestItem;

  beforeEach(() => {
    slot = new PokemonSlot();
    pokemon = new TestPokemon();
    tool = new TestTool();
    item = new TestItem();
  });

  it('should initialize with default values', () => {
    expect(slot.damage).toBe(0);
    expect(slot.specialConditions).toEqual([]);
    expect(slot.poisonDamage).toBe(10);
    expect(slot.burnDamage).toBe(20);
    expect(slot.pokemonPlayedTurn).toBe(0);
    expect(slot.pokemons.cards).toEqual([]);
    expect(slot.energies.cards).toEqual([]);
    expect(slot.trainers.cards).toEqual([]);
  });

  describe('getPokemons', () => {
    it('should return all pokemon cards', () => {
      slot.pokemons.cards.push(pokemon);
      expect(slot.getPokemons()).toEqual([pokemon]);
    });
  });

  describe('getTools', () => {
    it('should return only tool cards', () => {
      slot.trainers.cards.push(tool, item);
      expect(slot.getTools()).toEqual([tool]);
    });

    it('should return empty array when no tools', () => {
      slot.trainers.cards.push(item);
      expect(slot.getTools()).toEqual([]);
    });
  });

  describe('getPokemonCard', () => {
    it('should return undefined when no pokemon', () => {
      expect(slot.getPokemonCard()).toBeUndefined();
    });

    it('should return the last pokemon card', () => {
      const pokemon2 = new TestPokemon();
      slot.pokemons.cards.push(pokemon, pokemon2);
      expect(slot.getPokemonCard()).toBe(pokemon2);
    });
  });

  describe('isBasic', () => {
    it('should return true for single basic pokemon', () => {
      slot.pokemons.cards.push(pokemon);
      expect(slot.isBasic()).toBe(true);
    });

    it('should return false for multiple pokemon', () => {
      slot.pokemons.cards.push(pokemon, pokemon);
      expect(slot.isBasic()).toBe(false);
    });

    it('should return false for no pokemon', () => {
      expect(slot.isBasic()).toBe(false);
    });

    it('should return false for evolved pokemon', () => {
      const evolvedPokemon = new TestPokemon();
      evolvedPokemon.stage = Stage.STAGE_1;
      slot.pokemons.cards.push(evolvedPokemon);
      expect(slot.isBasic()).toBe(false);
    });
  });

  describe('special conditions', () => {
    it('should allow adding special conditions', () => {
      slot.specialConditions.push(SpecialCondition.ASLEEP);
      expect(slot.specialConditions).toContain(SpecialCondition.ASLEEP);
    });

    it('should allow setting poison damage', () => {
      slot.poisonDamage = 20;
      expect(slot.poisonDamage).toBe(20);
    });

    it('should allow setting burn damage', () => {
      slot.burnDamage = 30;
      expect(slot.burnDamage).toBe(30);
    });
  });
});