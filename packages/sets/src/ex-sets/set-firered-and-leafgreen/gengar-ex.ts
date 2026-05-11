import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  GameMessage,
  PokemonCard,
  ShowCardsPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '@ptcg/common';

export class GengarEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 150;

  public attacks = [
    {
      name: 'Poltergeist',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '40+',
      text:
        'Look at your opponent\'s hand. This attack does 40 damage plus 10 more damage for each Trainer card in your ' +
        'opponent\'s hand.'
    },
    {
      name: 'Prize Count',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '60+',
      text: 'If you have more Prize cards left than your opponent, this attack does 60 damage plus 40 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC },
    { type: CardType.DARK }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 },
    { type: CardType.COLORLESS, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Gengar ex';

  public fullName: string = 'Gengar ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.hand.cards.length === 0) {
        return state;
      }
      return store.prompt(
        state,
        new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards),
        () => {
          const trainers = opponent.hand.cards.filter(c => c instanceof TrainerCard);
          effect.damage += 10 * trainers.length;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
