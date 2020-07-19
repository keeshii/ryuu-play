import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { State, PlayerType, SlotType, PokemonCardList, CardTarget, Card } from 'ptcg-server';

export interface SelectionItem {
  cardList: PokemonCardList;
  selected: boolean;
}

export interface SelectionRow {
  items: SelectionItem[];
  target: CardTarget;
}

@Component({
  selector: 'ptcg-choose-pokemons-pane',
  templateUrl: './choose-pokemons-pane.component.html',
  styleUrls: ['./choose-pokemons-pane.component.scss']
})
export class ChoosePokemonsPaneComponent implements OnInit {

  public PlayerType = PlayerType;

  @Input() rows: SelectionRow[] = [];
  @Output() cardClick = new EventEmitter<SelectionItem>();
  @Output() cardDrop = new EventEmitter<[SelectionItem, Card]>();

  constructor() { }

  private static buildRow(cardLists: PokemonCardList[], player: PlayerType, slot: SlotType): SelectionRow {
    const target = { player, slot, index: 0 };
    const items = cardLists.map(cardList => ({cardList, selected: false}));
    return { target, items };
  }

  public static buildSelectionRows(
    state: State,
    playerId: number,
    playerType: PlayerType,
    slots: SlotType[]
  ): SelectionRow[] {
    const player = state.players.find(p => p.id === playerId);
    const opponent = state.players.find(p => p.id !== playerId);
    if (player === undefined || opponent === undefined) {
      return;
    }

    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(playerType);
    const hasBench = slots.includes(SlotType.BENCH);
    const hasActive = slots.includes(SlotType.ACTIVE);

    const rows: SelectionRow[] = [];
    if (hasOpponent && hasBench) {
      rows.push(this.buildRow(opponent.bench, PlayerType.TOP_PLAYER, SlotType.BENCH));
    }
    if (hasOpponent && hasActive) {
      rows.push(this.buildRow([opponent.active], PlayerType.TOP_PLAYER, SlotType.ACTIVE));
    }
    if (hasPlayer && hasActive) {
      rows.push(this.buildRow([player.active], PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE));
    }
    if (hasPlayer && hasBench) {
      rows.push(this.buildRow(player.bench, PlayerType.BOTTOM_PLAYER, SlotType.BENCH));
    }

    return rows;
  }

  public static buildTargets(rows: SelectionRow[]): CardTarget[] {
    const result: CardTarget[] = [];
    rows.forEach(row => row.items.forEach((item, index) => {
      if (item.selected) {
        result.push({...row.target, index });
      }
    }));
    return result;
  }

  public static  findTarget(rows: SelectionRow[], target: CardTarget): SelectionItem | undefined {
    const row = rows.find(r => r.target.player === target.player && r.target.slot === target.slot);
    if (row === undefined) {
      return undefined;
    }
    if (row.items.length <= target.index) {
      return undefined;
    }
    return row.items[target.index];
  }

  public static isBlocked(rows: SelectionRow[], item: SelectionItem, blocked: CardTarget[]) {
    for (const b of blocked) {
      const blockedItem = ChoosePokemonsPaneComponent.findTarget(rows, b);
      if (blockedItem === item) {
        return true;
      }
    }
    return false;
  }

  public onCardClick(item: SelectionItem) {
    this.cardClick.emit(item);
  }

  ngOnInit() {
  }

}
