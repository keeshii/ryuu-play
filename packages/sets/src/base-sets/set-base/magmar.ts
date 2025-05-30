import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Fire Punch',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '30',
      text: ''
    },
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: '50',
      text: 'Discard 1 Fire Energy card attached to Magmar in order to use this attack.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Magmar';

  public fullName: string = 'Magmar BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        }
      );
    }

    return state;
  }
}
