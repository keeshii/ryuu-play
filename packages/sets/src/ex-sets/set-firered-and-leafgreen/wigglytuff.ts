import {
  AttackEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SelectPrompt,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

function* useAssistance(
  next: Function,
  store: StoreLike,
  state: State,
  effect: PowerEffect,
  self: Wigglytuff
): IterableIterator<State> {
  const player = effect.player;

  let isWigglytuffOnBench = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
    if (target.slot === SlotType.BENCH && card === self) {
      isWigglytuffOnBench = true;
    }
  });

  if (!isWigglytuffOnBench) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const options: { message: GameMessage; value: SpecialCondition }[] = [
    {
      message: GameMessage.SPECIAL_CONDITION_PARALYZED,
      value: SpecialCondition.PARALYZED,
    },
    {
      message: GameMessage.SPECIAL_CONDITION_CONFUSED,
      value: SpecialCondition.CONFUSED,
    },
    {
      message: GameMessage.SPECIAL_CONDITION_ASLEEP,
      value: SpecialCondition.ASLEEP,
    },
    {
      message: GameMessage.SPECIAL_CONDITION_POISONED,
      value: SpecialCondition.POISONED,
    },
    {
      message: GameMessage.SPECIAL_CONDITION_BURNED,
      value: SpecialCondition.BURNED,
    },
  ].filter(item => player.active.specialConditions.includes(item.value));
  
  if (options.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  } 

  return store.prompt(
    state,
    new SelectPrompt(
      player.id,
      GameMessage.CHOOSE_SPECIAL_CONDITION,
      options.map(c => c.message),
      { allowCancel: false }
    ),
    choice => {
      const option = options[choice];

      if (option !== undefined) {
        player.active.removeSpecialCondition(option.value);
      }
    }
  );
}

export class Wigglytuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Jigglypuff';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Assistance',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), if Wigglytuff is on your Bench, you may choose 1 of your ' +
        'Active Pokémon and remove 1 Special Condition from it.'
    },
  ];

  public attacks = [
    {
      name: 'Expand',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'During your opponent\'s next turn, any damage done to Wigglytuff by attacks is reduced by 10 (after ' +
        'applying Weakness and Resistance).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Wigglytuff';

  public fullName: string = 'Wigglytuff RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      powerUseOnce.setMarker(effect);
      const generator = useAssistance(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      opponentNextTurn.setMarker(effect, effect.player.active);
      return state;
    }

    if (effect instanceof PutDamageEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.damage = Math.max(0, effect.damage - 10);
    }

    return state;
  }
}
