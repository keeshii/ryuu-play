import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Donphan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Phanpy';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Spinning Turn',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
    },
    {
      name: 'Wreck',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80+',
      text: 'If there is any Stadium card in play, this attack does 60 more damage. Discard that Stadium card.',
    },
  ];

  public set: string = 'BW4';

  public name: string = 'Donphan';

  public fullName: string = 'Donphan PLS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        selected => {
          if (!selected || selected.length === 0) {
            return state;
          }
          const target = selected[0];
          player.switchPokemon(target);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        effect.damage += 60;
        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
      }
    }

    return state;
  }
}
