import { CardType, GameMessage, PokemonCard, PokemonSlot } from '@ptcg/common';


export const VALUE_TO_TYPE: { [key: string]: CardType } = {
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

export const PROMPT_OPTIONS: { message: GameMessage, value: string }[] = [
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

export function getMarkerType(self: PokemonCard, markerType: string, target: PokemonSlot): CardType | undefined {
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

export function removeMarkersByName(markerType: string, target: PokemonSlot): void {
  const markers = target.marker.markers.filter(c => c.name.startsWith(markerType));
  for (const marker of markers) {
    target.marker.removeMarker(marker.name, marker.source);
  }
}
