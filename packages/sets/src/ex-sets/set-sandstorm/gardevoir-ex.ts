import {
  AttackEffect,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PlayerType,
  PokemonCard,
  PutCountersEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class GardevoirEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 150;

  public attacks = [
    {
      name: 'Feedback',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text:
        'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
    },
    {
      name: 'Psystorm',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10×',
      text: 'Does 10 damage times the total amount of Energy attached to all Pokémon in play.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS },
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Gardevoir ex';

  public fullName: string = 'Gardevoir ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const damage = opponent.hand.cards.length * 10;

      const putCountersEffect = new PutCountersEffect(effect, damage);
      store.reduceEffect(state, putCountersEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energies = 0;
      player.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, pokemonSlot);
        state = store.reduceEffect(state, checkProvidedEnergy);
        energies += checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, pokemonSlot);
        state = store.reduceEffect(state, checkProvidedEnergy);
        energies += checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);
      });

      effect.damage = energies * 10;
    }

    return state;
  }
}
