import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kadabra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Abra';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Recover',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text:
        'Discard 1 Psychic Energy card attached to Kadabra in order to use this attack. Remove all damage counters ' +
        'from Kadabra.'
    },
    {
      name: 'Super Psy',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Kadabra';

  public fullName: string = 'Kadabra BS';

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
          [CardType.PSYCHIC],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          const healEffect = new HealTargetEffect(effect, player.active.damage);
          healEffect.target = player.active;
          store.reduceEffect(state, healEffect);
        }
      );
    }

    return state;
  }
}
