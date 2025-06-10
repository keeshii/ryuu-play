import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Ralts3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Link Blast',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '40',
      text:
        'If Ralts and the Defending Pokémon have a different amount of Energy attached to them, this attack\'s base ' +
        'damage is 10 instead of 40.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Ralts';

  public fullName: string = 'Ralts RS-3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyPlayer = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergyPlayer);
      const playerEnergy = checkProvidedEnergyPlayer.energyMap.reduce((left, p) => left + p.provides.length, 0);

      const checkProvidedEnergyOpponent = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergyOpponent);
      const opponentEnergy = checkProvidedEnergyPlayer.energyMap.reduce((left, p) => left + p.provides.length, 0);

      if (playerEnergy !== opponentEnergy) {
        effect.damage = 10;
      }
    }

    return state;
  }
}
