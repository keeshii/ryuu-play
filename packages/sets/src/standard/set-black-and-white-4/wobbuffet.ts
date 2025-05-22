import {
  AttackEffect,
  CardType,
  CheckPokemonTypeEffect,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Bide Barricade',
      powerType: PowerType.ABILITY,
      text:
        'As long as this Pokémon is your Active Pokémon, each Pokémon in ' +
        'play, in each player\'s hand, and in each player\'s discard pile has ' +
        'no Abilities (except for P Pokémon).',
    },
  ];

  public attacks = [
    {
      name: 'Psychic Assault',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10+',
      text: 'This attack does 10 more damage for each damage counter on your opponent\'s Active Pokémon.',
    },
  ];

  public set: string = 'BW4';

  public name: string = 'Wobbuffet';

  public fullName: string = 'Wobbuffet PFO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.opponent.active.damage;
      return state;
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Wobbuffet is not active Pokemon
      if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      let cardTypes = [effect.card.cardType];

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are not blocking the Abilities from Psychic Pokemon
      if (cardTypes.includes(CardType.PSYCHIC)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }
}
