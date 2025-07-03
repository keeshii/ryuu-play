import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckPokemonTypeEffect,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  GamePhase,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Illumise extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Glowing Screen',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Volbeat is in play, any damage done to Illumise by attacks from F Pokémon and D Pokémon is ' +
        'reduced by 30. You can\'t reduce more than 30 damage even if there is more than 1 Volbeat in play.'
    },
  ];

  public attacks = [
    {
      name: 'Chaotic Noise',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, the Defending Pokémon is now ' +
        'Asleep.'
    },
    {
      name: 'Pester',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20+',
      text:
        'If the Defending Pokémon is affected by a Special Condition, this attack does 20 damage plus 20 more ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Illumise';

  public fullName: string = 'Illumise SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reduce damage (before Weakness and Resistance)
    if (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) {
      const opponent = StateUtils.findOwner(state, effect.target);

      // For Defending Pokemon use DealDamageEffect 
      if (effect instanceof DealDamageEffect && effect.target !== opponent.active) {
        return state;
      }

      // For Benched Pokemon use PutDamageEffect
      if (effect instanceof PutDamageEffect && effect.target === opponent.active) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Illumise is not target
      if (effect.target.getPokemonCard() !== this) {
        return state;
      }

      let hasVolbeat = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard.name === 'Volbeat') {
          hasVolbeat = true;
        }
      });

      // Volbeat not in play
      if (!hasVolbeat) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      // Attacking Pokemon is not Darkness or Fighting
      if (!checkPokemonType.cardTypes.includes(CardType.DARK)
        && !checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(opponent, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 30);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        const condition = result ? SpecialCondition.CONFUSED : SpecialCondition.ASLEEP;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [condition]);
        store.reduceEffect(state, specialConditionEffect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.length > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
