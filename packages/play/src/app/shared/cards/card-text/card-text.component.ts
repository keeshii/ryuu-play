import { Component, Input } from '@angular/core';

@Component({
  selector: 'ptcg-card-text',
  templateUrl: './card-text.component.html',
  styleUrls: ['./card-text.component.scss']
})
export class CardTextComponent {
  public items: { text: string, icon?: string }[] = [];

  private symbolToCss: { [symbol: string]: string } = {
    'C': 'colorless',
    'G': 'grass',
    'R': 'fire',
    'F': 'fighting',
    'L': 'lightning',
    'P': 'psychic',
    'W': 'water',
    'D': 'darkness',
    'M': 'metal',
    'N': 'dragon',
    'Y': 'fairy',
    'SHINY': 'shiny',
    'EX': 'ex',
    'BREAK': 'break',
    'DELTA': 'delta',
    'GAL': 'galaxy',
    'GL': 'gl',
    'MEGA': 'mega',
    'PRISM': 'prism',
    'GX': 'gx',
    'RYUU': 'ryuu',
  };

  private pattern: RegExp;

  constructor() {
    var symbols = Object.keys(this.symbolToCss);
    this.pattern = new RegExp('\\b(' + symbols.join('|') + ')\\b', 'g');
  }

  @Input() set value(value: string) {
    this.items = [];

    if (!value) {
      return;
    }

    this.pattern.lastIndex = 0;
    let pos = 0;
    do {
      const match = this.pattern.exec(value);

      if (match === null) {
        this.items.push({ text: value.substring(pos) });
        break;
      }

      if (match.index > pos) {
        this.items.push({ text: value.substring(pos, match.index) });
      }

      const symbol = match[0];
      pos = match.index + symbol.length;
      this.items.push({ text: '', icon: this.symbolToCss[symbol] });
    } while (true);
  }
}
