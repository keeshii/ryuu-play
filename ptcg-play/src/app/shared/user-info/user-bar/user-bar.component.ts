import { Component, OnInit, Input } from '@angular/core';
import { UserInfo, ClientInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss']
})
export class UserBarComponent implements OnInit {

  @Input() user: UserInfo | ClientInfo;

  public active: boolean;
  public name: string;

  constructor() { }

  ngOnInit(): void {
  }

}
