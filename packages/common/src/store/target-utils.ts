import { match } from '../utils';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { PokemonCard } from './card/pokemon-card';
import { FilterType } from './prompts/choose-cards-prompt';
import { StateUtils } from './state-utils';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { State } from './state/state';

export type SelectPokemonArgs = {
  atLeast?: number;
  atMost?: number;
  playerType?: PlayerType;
  slots?: SlotType[];
  is?: Partial<PokemonCard>;
  with?: FilterType;
}

export function getValidPokemonTargets(
  state: State,
  player: Player,
  {
    playerType = PlayerType.ANY,
    slots = [SlotType.ACTIVE, SlotType.BENCH],
    is = {},
    with: with_ = {},
  }: SelectPokemonArgs,
): {
  matches: PokemonCardList[];
  blocked: CardTarget[];
} {
  const players = [];
  if (playerType !== PlayerType.TOP_PLAYER) {
    players.push(player);
  }
  if (playerType !== PlayerType.BOTTOM_PLAYER) {
    players.push(StateUtils.getOpponent(state, player));
  }
  const matches: PokemonCardList[] = [];
  const blocked: CardTarget[] = [];
  function check(candidate: PokemonCardList, player: Player, slot: SlotType, index: number) {
    const pokemon = candidate.getPokemonCard()!;
    if (match(pokemon, is) && candidate.filter(with_).length > 0) {
      matches.push(candidate);
    } else {
      blocked.push({player: player.id, slot, index });
    }
  }
  for (const player of players) {
    for (const slot of slots) {
      if (slot === SlotType.ACTIVE) {
        check(player.active, player, SlotType.ACTIVE, 0);
      } else if (slot === SlotType.BENCH) {
        for (let i = 0; i < player.bench.length; i++) {
          const benchPokemon = player.bench[i];
          check(benchPokemon, player, SlotType.BENCH, i);
        }
      } else {
        throw new Error(`Invalid slot type for pokemon: ${slot}`);
      }
    }
  }
  return { matches, blocked };
}
