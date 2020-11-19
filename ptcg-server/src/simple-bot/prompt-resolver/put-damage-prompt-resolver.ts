import { Player, State, Action, ResolvePromptAction, Prompt, CardTarget,
  CardList, PlayerType, StateUtils, DamageMap } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { PutDamagePrompt } from '../../game/store/prompts/put-damage-prompt';

interface DamageTarget {
  target: CardTarget;
  cardList: CardList;
  hp: number;
  score: number;
}

export class PutDamagePromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof PutDamagePrompt) {
      const result = this.getPromptResult(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getPromptResult(state: State, prompt: PutDamagePrompt): DamageMap[] | null {
    const items = this.getTargets(state, prompt, prompt.options.blocked);
    const result: DamageMap[] = [];
    items.sort((a, b) => b.score - a.score);
    let score = 0;
    let promptDamage = prompt.damage;

    while (items.length > 0 && promptDamage > 0) {
      const item = items.shift();
      if (item === undefined) {
        break;
      }
      const target = item.target;
      const damage = Math.min(promptDamage, item.hp);
      promptDamage -= damage;
      item.hp -= damage;
      score += item.score * damage;
      result.push({ target, damage });
    }

    if (result.length === 0 && prompt.options.allowCancel) {
      return null;
    }

    if (score < 0 && prompt.options.allowCancel) {
      return null;
    }

    return result;
  }

  private getTargets(state: State, prompt: PutDamagePrompt, blocked: CardTarget[]): DamageTarget[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return [];
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    let results: DamageTarget[] = [];
    if (hasOpponent) {
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const maxHp = prompt.maxAllowedDamage.find(d => {
          return d.target.player === target.player
            && d.target.slot === target.slot
            && d.target.index === target.index;
        });
        const hp = maxHp ? maxHp.damage - cardList.damage : 0;
        const score = this.stateScore.getPokemonScore(cardList);

        if (hp > 0 && prompt.slots.includes(target.slot)) {
          results.push({ target, cardList, hp, score });
        }
      });
    }
    if (hasPlayer) {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const maxHp = prompt.maxAllowedDamage.find(d => {
          return d.target.player === target.player
            && d.target.slot === target.slot
            && d.target.index === target.index;
        });
        const hp = maxHp ? maxHp.damage - cardList.damage : 0;
        const score = -this.stateScore.getPokemonScore(cardList);

        if (hp > 0 && prompt.slots.includes(target.slot)) {
          results.push({ target, cardList, hp, score });
        }
      });
    }

    const blockedList: CardList[] = blocked.map(b => StateUtils.getTarget(state, player, b));
    results = results.filter(i => !blockedList.includes(i.cardList));
    return results;
  }

}
