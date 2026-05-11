import {
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Fearow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Spearow';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Free Flight',
      powerType: PowerType.POKEBODY,
      text: 'If Fearow has no Energy attached to it, Fearow\'s Retreat Cost is 0.'
    },
  ];

  public attacks = [
    {
      name: 'Shot Air',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text:
        'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.)'
    },
    {
      name: 'Drill Peck',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Fearow';

  public fullName: string = 'Fearow RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.pokemons.cards.includes(this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      // Energies attached to the active Pokemon
      if (player.active.energies.cards.length > 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.cost = [];
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );
    }

    return state;
  }
}
