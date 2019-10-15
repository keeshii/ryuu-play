import { Component } from '@angular/core';
import { MainService } from '../api/services/main.service';
import { Observable } from 'rxjs';

import { User } from '../shared/session/user.interface';

@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {
  title = 'ptcg-play';

  public users$: Observable<User[]>;
  public games$: Observable<any>;

  constructor(private mainSevice: MainService) {
    this.users$ = mainSevice.users$;
    this.games$ = mainSevice.games$;
  }

  public createGame() {
    this.mainSevice.createGame();
  }

}
