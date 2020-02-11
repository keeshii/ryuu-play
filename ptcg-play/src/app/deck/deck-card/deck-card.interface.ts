import { Card } from 'ptcg-server';
import { DeckEditPane } from '../deck-edit-pane/deck-edit-pane.interface';

export interface DeckCard extends Card {
  pane: DeckEditPane;
  count: number;
}
