import { Player, State, Action, ResolvePromptAction, Prompt, PokemonCardList,
  PlayerType, SlotType, StateUtils } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';


export class ChoosePokemonPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChoosePokemonPrompt) {
      const pokemons = this.buildPokemonToChoose(state, prompt).map(cardList => {
        let score = this.stateScore.getPokemonScore(cardList);
        // When it comes to the opponent, let's choose the weakest Pokemon
        if (prompt.playerType === PlayerType.TOP_PLAYER) {
          score = -score;
        }
        return { cardList, score };
      });

      pokemons.sort((a, b) => b.score - a.score);

      const result = pokemons.map(p => p.cardList).slice(0, prompt.options.min);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private buildPokemonToChoose(state: State, prompt: ChoosePokemonPrompt): PokemonCardList[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return [];
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasBench = prompt.slots.includes(SlotType.BENCH);
    const hasActive = prompt.slots.includes(SlotType.ACTIVE);

    let result: PokemonCardList[] = [];
    if (hasOpponent && hasBench) {
      opponent.bench.filter(b => b.cards.length).forEach(b => result.push(b));
    }
    if (hasOpponent && hasActive) {
      result.push(opponent.active);
    }
    if (hasPlayer && hasActive) {
      result.push(player.active);
    }
    if (hasPlayer && hasBench) {
      player.bench.filter(b => b.cards.length).forEach(b => result.push(b));
    }

    const blocked = prompt.options.blocked.map(b => StateUtils.getTarget(state, player, b));
    result = result.filter(r => !blocked.includes(r));
    return result;
  }


}
