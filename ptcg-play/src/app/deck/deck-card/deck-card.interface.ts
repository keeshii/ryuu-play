import { Card } from 'ptcg-server';
import { DeckEditPane } from '../deck-edit-panes/deck-edit-pane.interface';

export interface DeckCard extends Card {
  pane: DeckEditPane;
  count: number;
  scanUrl: string;
}
