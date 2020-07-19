import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PlayerType, Card } from 'ptcg-server';
import { PokemonData, PokemonItem, PokemonRow } from './pokemon-data';

@Component({
  selector: 'ptcg-choose-pokemons-pane',
  templateUrl: './choose-pokemons-pane.component.html',
  styleUrls: ['./choose-pokemons-pane.component.scss']
})
export class ChoosePokemonsPaneComponent implements OnInit {

  public PlayerType = PlayerType;

  @Input() set pokemonData(pokemonData: PokemonData) {
    this.rows = pokemonData.getRows();
  }

  @Output() cardClick = new EventEmitter<PokemonItem>();
  @Output() cardDrop = new EventEmitter<[PokemonItem, Card]>();

  public rows: PokemonRow[];

  constructor() { }

  public onCardClick(item: PokemonItem) {
    this.cardClick.emit(item);
  }

  ngOnInit() {
  }

}
