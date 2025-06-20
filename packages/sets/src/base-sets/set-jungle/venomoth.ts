import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckPokemonTypeEffect,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameLog,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SelectPrompt,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { changeType } from '../../common';

function* useShift(next: Function, store: StoreLike, state: State, self: Venomoth, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot
    || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
    || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
    || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  if (player.marker.hasMarker(self.SHIFT_MARKER)) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  const typesInPlay: CardType[] = [];
  const pokemonSlots: PokemonSlot[] = [player.active, ...player.bench, opponent.active, ...opponent.bench];
  pokemonSlots
    .filter(slot => slot !== pokemonSlot)
    .filter(slot => slot.pokemons.cards.length > 0)
    .forEach(slot => {
      const checkBenchPokemonType = new CheckPokemonTypeEffect(slot);
      store.reduceEffect(state, checkBenchPokemonType);

      checkBenchPokemonType.cardTypes.forEach(cardType => {
        if (!typesInPlay.includes(cardType) && cardType !== CardType.COLORLESS) {
          typesInPlay.push(cardType);
        }
      });
    });
    
  if (typesInPlay.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const promptOptions = changeType.PROMPT_OPTIONS
    .filter(option => typesInPlay.includes(changeType.VALUE_TO_TYPE[option.value]));

  return store.prompt(
    state,
    new SelectPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TYPE,
      promptOptions.map(p => p.message),
      { allowCancel: true }
    ),
    choice => {
      if (choice === null) {
        return;
      }
      const value = promptOptions[choice].value;
      const message = promptOptions[choice].message;
      store.log(state, GameLog.LOG_PLAYER_CHANGES_TYPE_TO, { name: player.name, message });
      changeType.removeMarkersByName(self.TYPE_CHANGE_MARKER, player.active);
      player.active.marker.addMarker(self.TYPE_CHANGE_MARKER + value, self);
    }
  );
}

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Venonat';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Shift',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may change the type of Venomoth to the type of any other ' +
        'Pokémon in play other than Colorless. This power can\'t be used if Venomoth is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Venom Powder',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Venomoth';

  public fullName: string = 'Venomoth JU';

  public readonly SHIFT_MARKER = 'SHIFT_MARKER';

  public readonly TYPE_CHANGE_MARKER = 'TYPE_CHANGE_MARKER_';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SHIFT_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useShift(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
            SpecialCondition.CONFUSED,
            SpecialCondition.POISONED
          ]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof CheckPokemonTypeEffect) {
      const cardType = changeType.getMarkerType(this, this.TYPE_CHANGE_MARKER, effect.target);
      if (cardType) {
        effect.cardTypes = [cardType];
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SHIFT_MARKER, this);
    }

    return state;
  }
}
