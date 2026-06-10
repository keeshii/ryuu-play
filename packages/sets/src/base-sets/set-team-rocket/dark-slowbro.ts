import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType
} from '@ptcg/common';

export class DarkSlowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slowpoke';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public powers = [
    {
      name: 'Reel In',
      powerType: PowerType.POKEPOWER,
      text:
        'When you play Dark Slowbro from your hand, choose up to 3 Basic Pokémon and/or Evolution cards from your ' +
        'discard pile and put them into your hand.'
    },
  ];

  public attacks = [
    {
      name: 'Fickle Attack',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '40',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Slowbro';

  public fullName: string = 'Dark Slowbro TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);
      const hasPokemonInDiscard = player.discard.cards.some(card => card.superType === SuperType.POKEMON);

      if (!hasPokemonInDiscard) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.POKEMON },
          { min: 0, max: 3, allowCancel: true }
        ),
        selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
