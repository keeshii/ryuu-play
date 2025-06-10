import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Electrode extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 80;

  public powers = [
    {
      name: 'Buzzap',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your ' +
        'other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) ' +
        'that provides 2 energy of that type. You can\'t use this power if Electrode is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Electric Shock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '50',
      text: 'Flip a coin. If tails, Electrode does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Electrode';

  public fullName: string = 'Electrode BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      // TODO - not implemented
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}
