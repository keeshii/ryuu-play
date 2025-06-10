import {
  AttachEnergyEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Combusken2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public powers = [
    {
      name: 'Natural Cure',
      powerType: PowerType.POKEBODY,
      text:
        'When you attach a R Energy card from your hand to Combusken, remove all Special Conditions from ' +
        'Combusken.',
    },
  ];

  public attacks = [
    {
      name: 'Lunge',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Flip a coin. If tails, this attack does nothing.',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      if (!effect.energyCard.provides.includes(CardType.FIRE)) {
        return state;
      }

      // pokemon is evolved
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
