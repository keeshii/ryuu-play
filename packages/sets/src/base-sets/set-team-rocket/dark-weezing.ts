import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkWeezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Koffing';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Mass Explosion',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20×',
      text:
        'Does 20 damage times the total number of Koffings, Weezings, and Dark Weezings in play (Apply Weakness and ' +
        'Resistance.). Then, this attack does 20 damage to each Koffing, Weezing, and Dark Weezing (even your own). ' +
        'Don\'t apply Weakness and Resistance.'
    },
    {
      name: 'Stun Gas',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '20',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Poisoned; if tails, the Defending Pokémon is now ' +
        'Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Weezing';

  public fullName: string = 'Dark Weezing TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const names = ['Koffing', 'Weezing', 'Dark Weezing'];

      const pokemonSlots: PokemonSlot[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (names.includes(pokemonCard.name)) {
          pokemonSlots.push(pokemonSlot);
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, pokemonCard) => {
        if (names.includes(pokemonCard.name)) {
          pokemonSlots.push(pokemonSlot);
        }
      });

      effect.damage = 20 * pokemonSlots.length;

      pokemonSlots.forEach(pokemonSlot => {
        const putDamage = new PutDamageEffect(effect, 20);
        putDamage.target = pokemonSlot;
        store.reduceEffect(state, putDamage);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        const specialCondition = result ? SpecialCondition.POISONED : SpecialCondition.PARALYZED;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [specialCondition]);
        store.reduceEffect(state, specialConditionEffect);
      });
    }

    return state;
  }
}
