import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptcg-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  public handItems = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
  }

}
