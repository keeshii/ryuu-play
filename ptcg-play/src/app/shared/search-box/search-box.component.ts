import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'ptcg-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @ViewChild(MatInput, {static: true}) searchInput: MatInput;
  @Output() search = new EventEmitter<string>();

  public isActivated = false;
  public searchValue = '';

  constructor() { }

  public activateSearch() {
    this.isActivated = true;
    setTimeout(() => this.searchInput.focus());
  }

  public clearSearch() {
    this.isActivated = false;
    if (this.searchValue !== '') {
      this.searchValue = '';
      this.search.next('');
    }
  }

  public onBlur() {
    if (this.searchValue === '') {
      this.isActivated = false;
    }
  }

  public onChange() {
    this.search.next(this.searchValue);
  }

}
