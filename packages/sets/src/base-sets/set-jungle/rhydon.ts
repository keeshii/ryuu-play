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

export class Rhydon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rhyhorn';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 100;

  public attacks = [
    {
      name: 'Horn Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Ram',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: '50',
      text:
        'Rhydon does 20 damage to itself. If your opponent has any Benched Pokémon, he or she chooses 1 of them and ' +
        'switches it with the Defending Pokémon. (Do the damage before switching the Pokémon. Switch the Pokémon ' +
        'even if Rhydon is knocked out.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Rhydon';

  public fullName: string = 'Rhydon JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);

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
