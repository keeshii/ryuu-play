import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ptcg-hover-highlight',
  templateUrl: './hover-highlight.component.html',
  styleUrls: ['./hover-highlight.component.scss']
})
export class HoverHighlightComponent implements OnInit {

  @Input()
  public enabled: boolean;

  constructor() { }

  ngOnInit() {
  }

}
