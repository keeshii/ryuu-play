import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkVaporeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Whirlpool',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '20',
      text: 'If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Vaporeon';

  public fullName: string = 'Dark Vaporeon TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (opponent.active.energies.cards.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active.energies,
          { },
          { min: 1, max: 1, allowCancel: false }
        ),
        selected => {
          const cards = selected || [];
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          return store.reduceEffect(state, discardEnergy);
        }
      );
    }

    return state;
  }
}
