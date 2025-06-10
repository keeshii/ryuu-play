import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class ElectabuzzEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Thundershock',
      cost: [CardType.LIGHTNING],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.',
    },
    {
      name: 'Quick Attack',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '40+',
      text: 'Flip a coin. If heads, this attack does 40 damage plus 20 more damage.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Electabuzz ex';

  public fullName: string = 'Electabuzz ex RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}
