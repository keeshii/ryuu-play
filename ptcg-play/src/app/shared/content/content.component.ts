import { Component, Input } from '@angular/core';

@Component({
  selector: 'ptcg-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  @Input() loading = false;

  constructor() { }

}
