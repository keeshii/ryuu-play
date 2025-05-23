import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  HealTargetEffect,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Beautifly extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Silcoon';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public powers = [
    {
      name: 'Withering Dust',
      powerType: PowerType.POKEBODY,
      text: 'As long as Beautifly is in play, do not apply Resistance for all Active Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Stun Spore',
      cost: [CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.',
    },
    {
      name: 'Parallel Gain',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Remove 1 damage counter from each of your Pokémon, including Beautifly.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Beautifly';

  public fullName: string = 'Beautifly RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isBeautiflyInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isBeautiflyInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isBeautiflyInPlay = true;
        }
      });

      if (!isBeautiflyInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.ignoreResistance = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const targets: PokemonCardList[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          targets.push(cardList);
        }
      });

      targets.forEach(target => {
        const healEffect = new HealTargetEffect(effect, 10);
        healEffect.target = target;
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}
