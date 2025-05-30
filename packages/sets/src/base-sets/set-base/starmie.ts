import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  HealTargetEffect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Staryu';

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Recover',
      cost: [CardType.WATER, CardType.WATER],
      damage: '',
      text:
        'Discard 1 W Energy card attached to Starmie in order to use this attack. Remove all damage counters ' +
        'from Starmie.'
    },
    {
      name: 'Star Freeze',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Starmie';

  public fullName: string = 'Starmie BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.WATER],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          const healEffect = new HealTargetEffect(effect, player.active.damage);
          healEffect.target = player.active;
          return store.reduceEffect(state, healEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
