import { PokemonCard } from './pokemon-card';
import { SuperType, Stage, CardType } from './card-types';
import { Attack, Weakness, Resistance, Power, PowerType } from './pokemon-types';

class TestPokemon extends PokemonCard {
  set = 'TEST';
  name = 'Test Pokemon';
  fullName = 'Test Pokemon TEST';
}

describe('PokemonCard', () => {
  let pokemon: TestPokemon;

  beforeEach(() => {
    pokemon = new TestPokemon();
  });

  it('should initialize with default values', () => {
    expect(pokemon.superType).toBe(SuperType.POKEMON);
    expect(pokemon.cardTypes).toEqual([]);
    expect(pokemon.evolvesFrom).toBe('');
    expect(pokemon.stage).toBe(Stage.BASIC);
    expect(pokemon.retreat).toEqual([]);
    expect(pokemon.hp).toBe(0);
    expect(pokemon.weakness).toEqual([]);
    expect(pokemon.resistance).toEqual([]);
    expect(pokemon.powers).toEqual([]);
    expect(pokemon.attacks).toEqual([]);
  });

  it('should set card types correctly', () => {
    pokemon.cardTypes = [CardType.FIRE, CardType.METAL];
    expect(pokemon.cardTypes).toEqual([CardType.FIRE, CardType.METAL]);
  });

  it('should set evolution details correctly', () => {
    pokemon.evolvesFrom = 'Base Pokemon';
    pokemon.stage = Stage.STAGE_1;
    
    expect(pokemon.evolvesFrom).toBe('Base Pokemon');
    expect(pokemon.stage).toBe(Stage.STAGE_1);
  });

  it('should set retreat cost correctly', () => {
    pokemon.retreat = [CardType.COLORLESS, CardType.COLORLESS];
    expect(pokemon.retreat).toEqual([CardType.COLORLESS, CardType.COLORLESS]);
  });

  it('should set HP correctly', () => {
    pokemon.hp = 100;
    expect(pokemon.hp).toBe(100);
  });

  it('should set weakness correctly', () => {
    const weakness: Weakness = {
      type: CardType.WATER,
      value: 2
    };
    pokemon.weakness = [weakness];
    expect(pokemon.weakness).toEqual([weakness]);
  });

  it('should set resistance correctly', () => {
    const resistance: Resistance = {
      type: CardType.FIGHTING,
      value: 30
    };
    pokemon.resistance = [resistance];
    expect(pokemon.resistance).toEqual([resistance]);
  });

  it('should set powers correctly', () => {
    const power: Power = {
      name: 'Test Power',
      text: 'Power description',
      powerType: PowerType.ABILITY
    };
    pokemon.powers = [power];
    expect(pokemon.powers).toEqual([power]);
  });

  it('should set attacks correctly', () => {
    const attack: Attack = {
      name: 'Test Attack',
      cost: [CardType.FIRE],
      damage: '20',
      text: 'Attack description'
    };
    pokemon.attacks = [attack];
    expect(pokemon.attacks).toEqual([attack]);
  });

  it('should have correct card identification', () => {
    expect(pokemon.set).toBe('TEST');
    expect(pokemon.name).toBe('Test Pokemon');
    expect(pokemon.fullName).toBe('Test Pokemon TEST');
  });
});