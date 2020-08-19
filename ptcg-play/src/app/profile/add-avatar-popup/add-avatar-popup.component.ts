import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptcg-add-avatar-popup',
  templateUrl: './add-avatar-popup.component.html',
  styleUrls: ['./add-avatar-popup.component.scss']
})
export class AddAvatarPopupComponent implements OnInit {

  public loading = false;
  public invalidName: string;
  public name: string;

  constructor() { }

  ngOnInit(): void {
  }

  confirm(): void {
  }

}
