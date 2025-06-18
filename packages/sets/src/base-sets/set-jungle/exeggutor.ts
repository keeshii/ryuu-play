import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Exeggcute';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Teleport',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Switch Exeggutor with 1 of your Benched Pokémon.'
    },
    {
      name: 'Big Eggsplosion',
      cost: [CardType.COLORLESS],
      damage: '20×',
      text:
        'Flip a number of coins equal to the number of Energy attached to Exeggutor. This attack does 20 damage ' +
        'times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Exeggutor';

  public fullName: string = 'Exeggutor JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.pokemons.cards.length > 0);
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
      const player = effect.player;
      
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      const coinFlipPrompts: CoinFlipPrompt[] = [];
      for (let i = 0; i < energyCount; i++) {
        coinFlipPrompts.push(new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP));
      }

      return store.prompt(
        state,
        coinFlipPrompts,
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 20 * heads;
        }
      );
    }

    return state;
  }
}
