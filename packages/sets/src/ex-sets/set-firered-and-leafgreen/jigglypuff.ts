import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Jigglypuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Sleep Inducer',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the ' +
        'Defending Pokémon to switch. The new Defending Pokémon is now Asleep.'
    },
    {
      name: 'Quick Blow',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Jigglypuff';

  public fullName: string = 'Jigglypuff RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (!hasBench) {
        // Q: if the opponent has no benched pokemon, does this attack do anything?
        // A: since there is no "new" Defending Pokemon, the attack does nothing.
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER, [SlotType.BENCH], {
          allowCancel: false,
        }),
        result => {
          const cardList = result[0];
          opponent.switchPokemon(cardList);

          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          store.reduceEffect(state, specialConditionEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}
