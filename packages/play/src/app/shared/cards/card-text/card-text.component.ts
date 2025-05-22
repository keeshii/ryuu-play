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
    'ex': 'ex2',
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
    const symbols = Object.keys(this.symbolToCss);
    this.pattern = new RegExp('(\\b|!)(' + symbols.join('|') + ')\\b', 'g');
  }

  @Input() set value(value: string) {
    this.items = [];

    if (!value) {
      return;
    }

    this.pattern.lastIndex = 0;
    let pos = 0;
    let text = '';
    let escapedSymbol = '';
    while (pos < value.length + 1) {
      const match = this.pattern.exec(value);

      if (match === null) {
        text = escapedSymbol + value.substring(pos);
        if (text !== '') {
          this.items.push({ text });
        }
        break;
      }

      const symbol = match[0];

      // "!" before symbol, ignore replacement
      if (symbol[0] === '!') {
        escapedSymbol = value.substring(pos, match.index) + symbol.substring(1);
        pos = match.index + symbol.length;
        continue;
      }

      if (match.index > pos) {
        text = escapedSymbol + value.substring(pos, match.index);
        this.items.push({ text });
        escapedSymbol = '';
      }

      pos = match.index + symbol.length;
      this.items.push({ text: '', icon: this.symbolToCss[symbol] });
    }
  }
}
