import { Component, OnInit, Input } from '@angular/core';
import { PlayerInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit {

  @Input() player: PlayerInfo;

  constructor() { }

  ngOnInit() { }

}
