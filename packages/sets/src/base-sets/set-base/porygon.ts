import {
  AttackEffect,
  CardType,
  CheckPokemonStatsEffect,
  Effect,
  GameLog,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  SelectPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

const VALUE_TO_TYPE: { [key: string]: CardType } = {
  'C': CardType.COLORLESS,
  'G': CardType.GRASS,
  'R': CardType.FIRE,
  'F': CardType.FIGHTING,
  'P': CardType.PSYCHIC,
  'W': CardType.WATER,
  'L': CardType.LIGHTNING,
  'M': CardType.METAL,
  'D': CardType.DARK,
  'N': CardType.DRAGON,
  'Y': CardType.FAIRY
};

const promptOptions: { message: GameMessage, value: string }[] = [
  { message: GameMessage.TYPE_GRASS, value: 'G' },
  { message: GameMessage.TYPE_FIRE, value: 'R' },
  { message: GameMessage.TYPE_FIGHTING, value: 'F' },
  { message: GameMessage.TYPE_PSYCHIC, value: 'P' },
  { message: GameMessage.TYPE_WATER, value: 'W' },
  { message: GameMessage.TYPE_LIGHTNING, value: 'L' },
  { message: GameMessage.TYPE_METAL, value: 'M' },
  { message: GameMessage.TYPE_DARK, value: 'D' },
  { message: GameMessage.TYPE_DRAGON, value: 'N' },
  { message: GameMessage.TYPE_FAIRY, value: 'Y' },
];

function getMarkerType(self: Porygon, markerType: string, target: PokemonSlot): CardType | undefined {
  const marker = target.marker.markers.find(c => c.name.startsWith(markerType) && c.source === self);
  if (!marker) {
    return;
  }
  const cardType: CardType = VALUE_TO_TYPE[marker.name.slice(-1)];
  if (!cardType) {
    return;
  }
  return cardType;
}

function removeMarkersByName(markerType: string, target: PokemonSlot): void {
  const markers = target.marker.markers.filter(c => c.name.startsWith(markerType));
  for (const marker of markers) {
    target.marker.removeMarker(marker.name, marker.source);
  }
}

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 30;

  public attacks = [
    {
      name: 'Conversion 1',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than Colorless.'
    },
    {
      name: 'Conversion 2',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Change Porygon\'s Resistance to a type of your choice other than Colorless.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon BS';

  public readonly WEAKNESS_CHANGE_MARKER = 'WEAKNESS_CHANGE_MARKER_';

  public readonly RESISTANCE_CHANGE_MARKER = 'RESISTANCE_CHANGE_MARKER_';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect) {
      const weakness = getMarkerType(this, this.WEAKNESS_CHANGE_MARKER, effect.target);
      const resitance = getMarkerType(this, this.RESISTANCE_CHANGE_MARKER, effect.target);

      if (weakness) {
        effect.weakness = effect.weakness.map(w => ({ type: weakness, value: w.value }));
      }

      if (resitance) {
        effect.resistance = effect.resistance.map(r => ({ type: resitance, value: r.value }));
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (!pokemonCard || pokemonCard.weakness.length === 0) {
        return state;
      }

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
          removeMarkersByName(this.WEAKNESS_CHANGE_MARKER, opponent.active);
          opponent.active.marker.addMarker(this.WEAKNESS_CHANGE_MARKER + value, this);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (!pokemonCard || pokemonCard.resistance.length === 0) {
        return state;
      }

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
          removeMarkersByName(this.RESISTANCE_CHANGE_MARKER, player.active);
          player.active.marker.addMarker(this.RESISTANCE_CHANGE_MARKER + value, this);
        }
      );
    }

    return state;
  }
}
