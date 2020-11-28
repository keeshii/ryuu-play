import { Player, State, Action, ResolvePromptAction, Prompt, StateUtils,
  PlayerType, CardList, Card, CardTarget, MoveEnergyPrompt, CardTransfer } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { deepClone } from '../../utils/utils';

interface TransferItem {
  fromItem: FromItem;
  toCardList: CardList;
  to: CardTarget;
  score: number;
}

interface TargetList {
  cardList: CardList;
  target: CardTarget;
}

interface FromItem {
  fromCardList: CardList;
  from: CardTarget;
  card: Card;
  cardIndex: number;
}

export class MoveEnergyPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof MoveEnergyPrompt) {
      const result = this.getPromptResult(state, prompt);
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private getPromptResult(state: State, prompt: MoveEnergyPrompt): CardTransfer[] | null {
    const copy = deepClone(state, [ Card ]);
    const fromItems = this.buildFromCardItems(copy, prompt);

    const max = prompt.options.max;
    const min = prompt.options.min;
    const result: TransferItem[] = [];

    let prevScore = this.getStateScore(state, prompt.playerId);
    let isNegative = false;

    while (fromItems.length > 0 && (!isNegative || result.length < min)) {
      const transfers = this.buildTransferItems(copy, prompt, fromItems);
      transfers.sort((a, b) => b.score - a.score);
      if (transfers.length === 0) {
        break;
      }

      const best = transfers[0];
      const fromIndex = fromItems.indexOf(best.fromItem);

      fromItems.splice(fromIndex, 1);

      if (best.score < prevScore) {
        isNegative = true;
      }

      // Moving any card gives negative score, and we are able to cancel
      // Don't append any results, just cancel the prompt
      if (isNegative && prompt.options.allowCancel) {
        break;
      }

      // Score is negative, and we already have minimum transfers
      if (isNegative && result.length >= min) {
        break;
      }

      const source = best.fromItem.fromCardList;
      const target = best.toCardList;
      const card = best.fromItem.card;
      source.moveCardTo(card, target);
      result.push(best);
      prevScore = best.score;

      if (max !== undefined && result.length >= max) {
        break;
      }
    }

    if (result.length === 0 && prompt.options.allowCancel) {
      return null;
    }

    if (result.length < min && prompt.options.allowCancel) {
      return null;
    }

    return this.translateItems(state, prompt, result);
  }

  private translateItems(state: State, prompt: MoveEnergyPrompt, items: TransferItem[]): CardTransfer[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (player === undefined) {
      return [];
    }

    return items.map(item => {
      const cardList = StateUtils.getTarget(state, player, item.fromItem.from);
      const card = cardList.cards[item.fromItem.cardIndex];
      return {
        from: item.fromItem.from,
        to: item.to,
        card
      };
    });
  }

  private buildTransferItems(state: State, prompt: MoveEnergyPrompt, fromCardItems: FromItem[]): TransferItem[] {
    const results: TransferItem[] = [];

    fromCardItems.forEach(item => {
      const fromCardList = item.fromCardList;
      const cardTargets = this.getTargets(state, prompt, prompt.options.blockedTo);
      for (const cardTarget of cardTargets) {
        if (cardTarget.cardList !== fromCardList) {
          fromCardList.moveCardTo(item.card, cardTarget.cardList);
          results.push({
            fromItem: item,
            to: cardTarget.target,
            toCardList: cardTarget.cardList,
            score: this.getStateScore(state, prompt.playerId)
          });
          cardTarget.cardList.moveCardTo(item.card, fromCardList);
        }
      }
    });

    return results;
  }

  private buildFromCardItems(state: State, prompt: MoveEnergyPrompt): FromItem[] {
    const fromCardItems: FromItem[] = [];

    const fromTargets = this.getTargets(state, prompt, prompt.options.blockedFrom);
    fromTargets.forEach(fromTarget => {
      const blockedMap = prompt.options.blockedMap.find(b => {
        return b.source.player === fromTarget.target.player
          && b.source.slot === fromTarget.target.slot
          && b.source.index === fromTarget.target.index;
      });
      const blocked = blockedMap ? blockedMap.blocked : [];
      const cardList = new CardList();
      fromTarget.cardList.cards.forEach((card, index) => {
        if (!blocked.includes(index)) {
          cardList.cards.push(card);
        }
      });
      cardList.cards = cardList.filter(prompt.filter);
      cardList.cards.forEach(card => {
        fromCardItems.push({
          fromCardList: fromTarget.cardList,
          from: fromTarget.target,
          card: card,
          cardIndex: fromTarget.cardList.cards.indexOf(card)
        });
      });
    });
    return fromCardItems;
  }

  private getTargets(state: State, prompt: MoveEnergyPrompt, blocked: CardTarget[]): TargetList[] {
    const player = state.players.find(p => p.id === prompt.playerId);
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (player === undefined || opponent === undefined) {
      return [];
    }
    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(prompt.playerType);
    let results: TargetList[] = [];
    if (hasOpponent) {
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (prompt.slots.includes(target.slot)) {
          results.push({ target, cardList });
        }
      });
    }
    if (hasPlayer) {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (prompt.slots.includes(target.slot)) {
          results.push({ target, cardList });
        }
      });
    }

    const blockedList: CardList[] = blocked.map(b => StateUtils.getTarget(state, player, b));
    results = results.filter(i => !blockedList.includes(i.cardList));
    return results;
  }

}
