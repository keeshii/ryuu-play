import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ptcg-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  public colorClass: {[key: string]: boolean} = {};

  @Input() set color(value: string) {
    const knownColors = ['primary', 'accent', 'warn'];
    if (knownColors.includes(value)) {
      this.colorClass = {};
      this.colorClass[`mat-${value}`] = true;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
