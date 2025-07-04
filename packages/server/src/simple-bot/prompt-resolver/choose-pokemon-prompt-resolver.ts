import { Player, State, Action, ResolvePromptAction, Prompt, PokemonSlot,
  PlayerType, SlotType, StateUtils, GameMessage } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { ChoosePokemonPrompt } from '@ptcg/common';

interface PlayerCardList {
  pokemonSlot: PokemonSlot;
  player: PlayerType;
}

export class ChoosePokemonPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChoosePokemonPrompt) {
      const items = this.buildPokemonToChoose(state, prompt);
      const result = this.getPromptResult(prompt, items);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getPromptResult(prompt: ChoosePokemonPrompt, pokemons: PlayerCardList[]): PokemonSlot[] | null {
    const items = pokemons.map(item => {
      const score = this.getPokemonScoreForPrompt(prompt, item);
      return { pokemonSlot: item.pokemonSlot, score };
    });
    items.sort((a, b) => b.score - a.score);

    const result: PokemonSlot[] = [];
    const min = prompt.options.min;
    const max = prompt.options.max;
    let score = 0;

    while (items.length > 0 && (items[0].score > 0 || result.length < min)) {
      const item = items.shift();
      if (item === undefined) {
        break;
      }
      result.push(item.pokemonSlot);
      score += item.score;

      if (result.length >= max) {
        break;
      }
    }

    if (result.length === 0 && prompt.options.allowCancel) {
      return null;
    }

    if (score < 0 && prompt.options.allowCancel) {
      return null;
    }

    return result;
  }

  private getPokemonScoreForPrompt(prompt: ChoosePokemonPrompt, item: PlayerCardList): number {
    let score = this.stateScore.getPokemonScore(item.pokemonSlot);

    if (item.player === PlayerType.TOP_PLAYER) {
      score = -score;
    }

    // reverse messages
    const weakestMessages: GameMessage[] = [
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP
    ];

    if (weakestMessages.includes(prompt.message)) {
      score = -score;
    }

    return score;
  }

  private buildPokemonToChoose(state: State, prompt: ChoosePokemonPrompt): PlayerCardList[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return [];
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasBench = prompt.slots.includes(SlotType.BENCH);
    const hasActive = prompt.slots.includes(SlotType.ACTIVE);

    let result: PlayerCardList[] = [];
    if (hasOpponent && hasBench) {
      opponent.bench.filter(b => b.pokemons.cards.length).forEach(b => {
        result.push({ pokemonSlot: b, player: PlayerType.TOP_PLAYER });
      });
    }
    if (hasOpponent && hasActive) {
      result.push({ pokemonSlot: opponent.active, player: PlayerType.TOP_PLAYER });
    }
    if (hasPlayer && hasActive) {
      result.push({ pokemonSlot: player.active, player: PlayerType.BOTTOM_PLAYER });
    }
    if (hasPlayer && hasBench) {
      player.bench.filter(b => b.pokemons.cards.length).forEach(b => {
        result.push({ pokemonSlot: b, player: PlayerType.BOTTOM_PLAYER });
      });
    }

    const blocked = prompt.options.blocked.map(b => StateUtils.getTarget(state, player, b));
    result = result.filter(r => !blocked.includes(r.pokemonSlot));
    return result;
  }

}
