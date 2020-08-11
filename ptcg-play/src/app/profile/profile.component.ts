import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  displayedColumns: string[] = ['id', 'player1', 'player2', 'result', 'actions'];
  matches: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
