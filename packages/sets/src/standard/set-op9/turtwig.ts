import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  HealTargetEffect,
  PlayerType,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Turtwig extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public weakness = [
    {
      type: CardType.FIRE,
      value: 10,
    },
  ];

  public resistance = [
    {
      type: CardType.WATER,
      value: -20,
    },
  ];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Absorb',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'Remove 1 damage counter from Turtwig.',
    },
    {
      name: 'Parboil',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text:
        'If you have Chimchar in play, this attack does 40 damage plus 20 ' +
        'more damage and the Defending Pokémon is now Burned.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Turtwig';

  public fullName: string = 'Turtwig OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 10);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isChimcharInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Chimchar') {
          isChimcharInPlay = true;
        }
      });

      if (isChimcharInPlay) {
        effect.damage += 20;
        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
        store.reduceEffect(state, specialCondition);
      }
    }

    return state;
  }
}
