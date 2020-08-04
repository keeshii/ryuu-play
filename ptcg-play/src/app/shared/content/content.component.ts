import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ptcg-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @Input() loading = false;

  constructor() { }

  ngOnInit() {
  }

}
