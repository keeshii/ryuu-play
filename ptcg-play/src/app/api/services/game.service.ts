import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Action, Prompt, State } from 'ptcg-server';

// import { User } from 'src/app/shared/session/user.interface';

@Injectable()
export class GameService {

  constructor() { }

  public onStateChange: Observable<State> = new Subject<State>();

  public onStateStabe: Observable<State> = new Subject<State>();

  public onResolvePrompt: Observable<Prompt<any>> = new Subject<Prompt<any>>();

  public play(deck: string[]) { }

  public dispatch(action: Action) { }

}
