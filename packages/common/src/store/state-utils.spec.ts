import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { CardType } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { TrainerCard } from './card/trainer-card';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { StateUtils } from './state-utils';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { PokemonSlot } from './state/pokemon-slot';
import { State } from './state/state';

describe('StateUtils', () => {

  describe('checkEnoughEnergy', () => {
    it('should return true if cost is empty', () => {
      const energyMap: EnergyMap[] = [];
      const cost: CardType[] = [];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });

    it('should return true if all energies provided', () => {
      const energyMap = [
        { provides: [CardType.FIRE, CardType.GRASS], provideAmount: 1 },
        { provides: [CardType.FIRE], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.GRASS];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });

    it('should return false if not all energies provided', () => {
      const energyMap = [
        { provides: [CardType.FIRE, CardType.GRASS], provideAmount: 1 },
        { provides: [CardType.FIRE], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.GRASS, CardType.GRASS];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(false);
    });

    it('should return true if multiple energy cards cover the cost', () => {
      const energyMap = [
        { provides: [CardType.FIRE], provideAmount: 1 },
        { provides: [CardType.WATER], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.WATER];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });

    it('should return true if cost requires COLORLESS energy', () => {
      const energyMap = [
        { provides: [CardType.FIRE], provideAmount: 1 },
        { provides: [CardType.WATER], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.COLORLESS];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });

    it('should return false if energyMap contains COLORLESS energy', () => {
      const energyMap = [
        { provides: [CardType.FIRE], provideAmount: 1 },
        { provides: [CardType.COLORLESS], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.WATER];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(false);
    });

    it('should return true when first energy covers both first and second energy cost', () => {
      const energyMap = [
        { provides: [CardType.FIRE, CardType.WATER], provideAmount: 1 },
        { provides: [CardType.FIRE], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.WATER];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });

    it('should return false when cost requires two energies and energyMap has only one', () => {
      const energyMap = [
        { provides: [CardType.FIRE, CardType.WATER], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.WATER];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(false);
    });

    it('should return true when energyMap provides two energies', () => {
      const energyMap = [
        { provides: [CardType.FIRE, CardType.WATER], provideAmount: 2 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.WATER];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });

    it('should return true for complex energyMap and cost', () => {
      const energyMap = [
        { provides: [CardType.FIRE, CardType.WATER], provideAmount: 1 },
        { provides: [CardType.GRASS, CardType.WATER, CardType.FIRE], provideAmount: 1 },
        { provides: [CardType.PSYCHIC, CardType.WATER], provideAmount: 2 },
        { provides: [CardType.GRASS], provideAmount: 1 },
      ] as EnergyMap[];
      const cost: CardType[] = [CardType.FIRE, CardType.WATER, CardType.WATER, CardType.PSYCHIC, CardType.COLORLESS];
      expect(StateUtils.checkEnoughEnergy(energyMap, cost)).toEqual(true);
    });
  });

  describe('countAdditionalEnergy', () => {
    it('should return zero when no additional energy', () => {
      const energyMap = [{ provides: [CardType.WATER], provideAmount: 1 }] as EnergyMap[];
      const cost = [CardType.WATER];
      const result = StateUtils.countAdditionalEnergy(energyMap, cost);
      expect(result).toEqual(0);
    });

    it('should count specific energy type', () => {
      const energyMap = [
        { provides: [CardType.WATER], provideAmount: 1 },
        { provides: [CardType.WATER], provideAmount: 1 },
        { provides: [CardType.FIRE], provideAmount: 1 }
      ] as EnergyMap[];
      const cost = [CardType.WATER];
      const result = StateUtils.countAdditionalEnergy(energyMap, cost, CardType.WATER);
      expect(result).toEqual(1);
    });

    it('Should count energy cards that provide more than one energy', () => {
      const energyMap = [
        { provides: [CardType.WATER], provideAmount: 2 },
        { provides: [CardType.WATER], provideAmount: 1 },
        { provides: [CardType.FIRE], provideAmount: 1 }
      ] as EnergyMap[];
      const cost = [CardType.WATER];
      const result = StateUtils.countAdditionalEnergy(energyMap, cost, CardType.WATER);
      expect(result).toEqual(2);
    });
  });

  describe('checkExactEnergy', () => {
    it('should return true when energy is exactly equal to the cost', () => {
      const energyMap =  [
        { provideAmount: 1, provides: [ CardType.GRASS ] }
      ] as EnergyMap[];
      const cost = [ CardType.GRASS ];
      expect(StateUtils.checkExactEnergy(energyMap, cost)).toBe(true);
    });

    it('should return false when energy is not exactly equal to the cost', () => {
      const energyMap =  [
        { provideAmount: 1, provides: [ CardType.GRASS ] }
      ] as EnergyMap[];
      const cost = [ CardType.FIGHTING ];
      expect(StateUtils.checkExactEnergy(energyMap, cost)).toBe(false);
    });

    it('should return true when energy is more than the cost', () => {
      const energyMap =  [
        { provideAmount: 2, provides: [ CardType.GRASS ] }
      ] as EnergyMap[];
      const cost = [ CardType.GRASS ];
      expect(StateUtils.checkExactEnergy(energyMap, cost)).toBe(true);
    });

    it('should return true when energy is equal to the cost (single card)', () => {
      const energyMap =  [
        { provideAmount: 2, provides: [ CardType.GRASS ] }
      ] as EnergyMap[];
      const cost = [ CardType.GRASS, CardType.GRASS ];
      expect(StateUtils.checkExactEnergy(energyMap, cost)).toBe(true);
    });

    it('should return false when energy is more than the cost', () => {
      const energyMap =  [
        { provideAmount: 1, provides: [ CardType.GRASS ] },
        { provideAmount: 1, provides: [ CardType.GRASS ] }
      ] as EnergyMap[];
      const cost = [ CardType.GRASS ];
      expect(StateUtils.checkExactEnergy(energyMap, cost)).toBe(false);
    });
  });

  describe('rainbowEnergy', () => {
    it('should return the rainbow energy types', () => {
      const result = StateUtils.rainbowEnergy();
      expect(result).toEqual([
        CardType.GRASS,
        CardType.FIGHTING,
        CardType.PSYCHIC,
        CardType.WATER,
        CardType.LIGHTNING,
        CardType.METAL,
        CardType.DARK,
        CardType.FIRE,
        CardType.DRAGON,
        CardType.FAIRY
      ]);
    });
  });

  describe('getOpponent', () => {
    it('should return the opponent if found', () => {
      const state = {
        players: [
          { id: 1, name: 'Player 1' },
          { id: 2, name: 'Player 2' }
        ]
      } as State;
      const player = state.players[0];
      expect(StateUtils.getOpponent(state, player)).toBe(state.players[1]);
    });

    it('should return the player if found', () => {
      const state = {
        players: [
          { id: 1, name: 'Player 1' },
          { id: 2, name: 'Player 2' }
        ]
      } as State;
      const player = state.players[1];
      expect(StateUtils.getOpponent(state, player)).toBe(state.players[0]);
    });

    it('should throw an error if opponent not found', () => {
      const state = {
        players: [
          { id: 1, name: 'Player 1' }
        ]
      } as State;
      const player = state.players[0];
      expect(() => StateUtils.getOpponent(state, player))
        .toThrow(new GameError(GameMessage.INVALID_GAME_STATE));
    });
  });

  describe('getTarget', () => {
    it('should return the active Pokemon slot if target type is ACTIVE', () => {
      const state = new State();
      const player = new Player();
      state.players = [player];
      const target: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
      expect(StateUtils.getTarget(state, player, target)).toBe(player.active);
    });

    it('should return the benched Pokemon slot if target type is BENCH', () => {
      const state = new State();
      const player = new Player();
      player.bench = [new PokemonSlot(), new PokemonSlot(), new PokemonSlot()];
      state.players = [player];
      const target: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 };
      expect(StateUtils.getTarget(state, player, target)).toBe(player.bench[1]);
    });

    it('should throw an error if target index is out of bounds', () => {
      const state = new State();
      const player = new Player();
      state.players = [player];
      const target: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 };
      expect(() => StateUtils.getTarget(state, player, target))
        .toThrow(new GameError(GameMessage.INVALID_TARGET));
    });

    it('should hrow an error for different target types', () => {
      const state = new State();
      const player = new Player();
      state.players = [player];
      const target: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 };
      expect(() => StateUtils.getTarget(state, player, target))
        .toThrow(new GameError(GameMessage.INVALID_TARGET));
    });

    it('should return the target for an opponent', () => {
      const state = {
        players: [
          { id: 1, name: 'Player 1', active: new PokemonSlot() },
          { id: 2, name: 'Player 2', active: new PokemonSlot() }
        ]
      } as State;
      const player = state.players[0];
      const opponent = state.players[1];
      const target: CardTarget = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
      expect(StateUtils.getTarget(state, player, target)).toBe(opponent.active);
    });
  });

  describe('findCardList', () => {
    it('should return the card list if found', () => {
      const state = new State();
      state.players.push(new Player());
      state.players[0].bench = [new PokemonSlot()];
      state.players[0].prizes = [new CardList()];
      const card: Card = { id: 1, name: 'Card', set: 'Test' } as any;
      state.players[0].discard.cards.push(card);
      expect(StateUtils.findCardList(state, card)).toBe(state.players[0].discard);
    });

    it('should throw an error if card list not found', () => {
      const state = new State();
      state.players.push(new Player());
      state.players[0].bench = [new PokemonSlot()];
      state.players[0].prizes = [new CardList()];
      const card: Card = { id: 1, name: 'Card', set: 'Test' } as any;
      expect(() => StateUtils.findCardList(state, card))
        .toThrow(new GameError(GameMessage.INVALID_GAME_STATE));
    });
  });

  describe('findPokemonSlot', () => {
    it('should return the slot if found', () => {
      const state = new State();
      state.players.push(new Player());
      state.players[0].bench = [new PokemonSlot()];
      const card: PokemonCard = { id: 1, name: 'Card', set: 'Test' } as any;
      state.players[0].bench[0].pokemons.cards.push(card);
      expect(StateUtils.findPokemonSlot(state, card)).toBe(state.players[0].bench[0]);
    });

    it('should return undefined if slot not found', () => {
      const state = new State();
      state.players.push(new Player());
      state.players[0].bench = [new PokemonSlot()];
      const card: PokemonCard = { id: 1, name: 'Card', set: 'Test' } as any;
      expect(StateUtils.findPokemonSlot(state, card)).toEqual(undefined);
    });
  });
  
  describe('findOwner', () => {
    it('should return owner of the card list', () => {
      const state = new State();
      state.players.push(new Player());
      state.players[0].bench = [new PokemonSlot()];
      state.players[0].prizes = [new CardList()];
      state.players.push(new Player());
      state.players[1].bench = [new PokemonSlot()];
      state.players[1].prizes = [new CardList()];

      expect(StateUtils.findOwner(state, state.players[0].active)).toBe(state.players[0]);
      expect(StateUtils.findOwner(state, state.players[0].bench[0])).toBe(state.players[0]);
      expect(StateUtils.findOwner(state, state.players[0].prizes[0])).toBe(state.players[0]);
      expect(StateUtils.findOwner(state, state.players[0].hand)).toBe(state.players[0]);
      expect(StateUtils.findOwner(state, state.players[0].discard)).toBe(state.players[0]);
      expect(StateUtils.findOwner(state, state.players[0].deck)).toBe(state.players[0]);

      expect(StateUtils.findOwner(state, state.players[1].active)).toBe(state.players[1]);
      expect(StateUtils.findOwner(state, state.players[1].bench[0])).toBe(state.players[1]);
      expect(StateUtils.findOwner(state, state.players[1].prizes[0])).toBe(state.players[1]);
      expect(StateUtils.findOwner(state, state.players[1].hand)).toBe(state.players[1]);
      expect(StateUtils.findOwner(state, state.players[1].discard)).toBe(state.players[1]);
      expect(StateUtils.findOwner(state, state.players[1].deck)).toBe(state.players[1]);
    });

    it('should throw error for invalid card list', () => {
      const state = new State();
      const cardList = new CardList();

      expect(() => StateUtils.findOwner(state, cardList))
        .toThrow(new GameError(GameMessage.INVALID_GAME_STATE));
    });
  });

  describe('getStadiumCard', () => {
    it('should return the stadium card if found', () => {
      const state = new State();
      state.players.push(new Player());
      const stadium: TrainerCard = { id: 1, name: 'Stadium', set: 'Test' } as any;
      state.players[0].stadium.cards.push(stadium);
      expect(StateUtils.getStadiumCard(state)).toBe(stadium);
    });

    it('should return undefined if stadium card not found', () => {
      const state = new State();
      state.players.push(new Player());
      expect(StateUtils.getStadiumCard(state)).toEqual(undefined);
    });
  });
});
