import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

export class DarkGloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Oddish';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public powers = [
    {
      name: 'Pollen Stench',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now ' +
        'Confused; if tails, your Active Pokémon is now Confused. This power can\'t be used if Dark Gloom is Asleep, ' +
        'Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '10',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Gloom';

  public fullName: string = 'Dark Gloom TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        const target = result ? opponent.active : player.active;
        target.addSpecialCondition(SpecialCondition.CONFUSED);
        powerUseOnce.setMarker(effect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
