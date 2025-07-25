import { Player, State, Action, ResolvePromptAction, Prompt, CardTarget,
  PlayerType, StateUtils, DamageMap, PokemonSlot, MoveDamagePrompt } from '@ptcg/common';
import { PromptResolver } from './prompt-resolver';
import { PutDamagePrompt } from '@ptcg/common';

export type DamagePromptResolverType = PutDamagePrompt | MoveDamagePrompt;

export interface DamagePromptResolverTarget {
  target: CardTarget;
  pokemonSlot: PokemonSlot;
  damage: number;
  hp: number;
  score: number;
}

export class PutDamagePromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof PutDamagePrompt) {
      const result = this.getPutDamagePromptResult(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getPutDamagePromptResult(state: State, prompt: PutDamagePrompt): DamageMap[] | null {
    const items = this.getTargets(state, prompt, prompt.options.blocked);

    const result: DamageMap[] = [];
    let score = 0;
    let promptDamage = prompt.damage;

    while (items.length > 0 && promptDamage > 0) {
      const item = items.shift();
      if (item === undefined) {
        break;
      }
      const target = item.target;
      const hpLeft = item.hp - item.damage;
      const damage = Math.min(promptDamage, hpLeft);
      promptDamage -= damage;
      item.damage += damage;
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

  protected getTargets(
    state: State,
    prompt: DamagePromptResolverType,
    blocked: CardTarget[]
  ): DamagePromptResolverTarget[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return [];
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    let results: DamagePromptResolverTarget[] = [];
    if (hasOpponent) {
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card, target) => {
        const maxAllowedDamage = prompt.maxAllowedDamage.find(d => {
          return d.target.player === target.player
            && d.target.slot === target.slot
            && d.target.index === target.index;
        });
        const hp = maxAllowedDamage ? maxAllowedDamage.damage : 0;
        const damage = pokemonSlot.damage;
        const score = this.stateScore.getPokemonScore(pokemonSlot);

        if (hp > 0 && prompt.slots.includes(target.slot)) {
          results.push({ target, pokemonSlot, damage, hp, score });
        }
      });
    }
    if (hasPlayer) {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
        const maxHp = prompt.maxAllowedDamage.find(d => {
          return d.target.player === target.player
            && d.target.slot === target.slot
            && d.target.index === target.index;
        });
        const hp = maxHp ? maxHp.damage - pokemonSlot.damage : 0;
        const damage = pokemonSlot.damage;
        const score = -this.stateScore.getPokemonScore(pokemonSlot);

        if (hp > 0 && prompt.slots.includes(target.slot)) {
          results.push({ target, pokemonSlot, damage, hp, score });
        }
      });
    }

    const blockedList: PokemonSlot[] = blocked.map(b => StateUtils.getTarget(state, player, b));
    results = results.filter(i => !blockedList.includes(i.pokemonSlot));
    results.sort((a, b) => b.score - a.score);
    return results;
  }

}
