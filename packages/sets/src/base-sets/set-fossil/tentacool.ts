import {
  CardType,
  ConfirmPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Tentacool extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 30;

  public powers = [
    {
      name: 'Cowardice',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'At any time during your turn (before your attack), you may return Tentacool to your hand. (Discard all ' +
        'cards attached to Tentacool.) This power can\'t be used the turn you put Tentacool into play or if ' +
        'Tentacool is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Acid',
      cost: [CardType.WATER],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Tentacool';

  public fullName: string = 'Tentacool FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (pokemonSlot.pokemonPlayedTurn === state.turn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_PICK_UP_POKEMON), result => {
        if (result) {
          pokemonSlot.pokemons.moveTo(player.hand);
          pokemonSlot.moveTo(player.discard);
          pokemonSlot.clearEffects();
        }
      });
    }

    return state;
  }
}
