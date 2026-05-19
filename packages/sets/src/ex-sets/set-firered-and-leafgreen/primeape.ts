import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerType
} from '@ptcg/common';

export class Primeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mankey';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Toss',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30×',
      text:
        'You may discard from your hand as many Technical Machine and Pokémon Tool cards as you like. This attack ' +
        'does 30 damage times the number of cards you discarded.'
    },
    {
      name: 'Low Kick',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [];

  public set: string = 'RG';

  public name: string = 'Primeape';

  public fullName: string = 'Primeape RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasToolsInHand = player.hand.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL);
      if (!hasToolsInHand) {
        effect.damage = 0;
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
          { allowCancel: true }
        ),
        selected => {
          const cards = selected || [];
          player.hand.moveCardsTo(cards, player.discard);
          effect.damage = cards.length * 30;
        }
      );
    }

    return state;
  }
}
