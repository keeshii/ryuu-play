import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public weakness = [
    {
      type: CardType.LIGHTNING,
      value: 10,
    },
  ];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Water Sport',
      cost: [CardType.WATER],
      damage: '10+',
      text:
        'If Piplup has less Energy attached to it than the Defending ' +
        'Pokémon, this attack does 10 damage plus 10 more damage.',
    },
    {
      name: 'Wavelet',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text:
        'If you have Buizel in play, this attack does 10 damage to each ' +
        'of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.)',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Piplup';

  public fullName: string = 'Piplup OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, playerEnergy);

      const opponentEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, opponentEnergy);

      let playerEnergyCount = 0;
      playerEnergy.energyMap.forEach(e => (playerEnergyCount += e.provides.length));

      let opponentEnergyCount = 0;
      opponentEnergy.energyMap.forEach(e => (opponentEnergyCount += e.provides.length));

      if (playerEnergyCount < opponentEnergyCount) {
        effect.damage += 10;
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isBuizelInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Buizel') {
          isBuizelInPlay = true;
        }
      });

      if (isBuizelInPlay) {
        opponent.bench.forEach(benched => {
          if (benched.pokemons.cards.length > 0) {
            const dealDamage = new PutDamageEffect(effect, 10);
            dealDamage.target = benched;
            return store.reduceEffect(state, dealDamage);
          }
        });
      }
    }

    return state;
  }
}
