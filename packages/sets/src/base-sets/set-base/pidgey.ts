import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Pidgey extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text:
        'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending ' +
        'Pokémon. (Do the damage before switching the Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Pidgey';

  public fullName: string = 'Pidgey BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (targets && targets.length > 0) {
            const dealDamage = new DealDamageEffect(effect, effect.damage);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
            effect.damage = 0;

            opponent.switchPokemon(targets[0]);
          }
        }
      );
    }


    return state;
  }
}
