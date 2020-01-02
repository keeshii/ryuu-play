import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginPopupService } from '../../shared/login-popup/login-popup.service';
import { SessionService } from '../../shared/session/session.service';
import { User } from '../../shared/session/user.interface';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit, OnDestroy {

  private loggedUser$: Observable<User | undefined>;
  public loggedUser: User | undefined;

  constructor(
    private loginPopupService: LoginPopupService,
    private sessionService: SessionService
  ) {
    this.loggedUser$ = this.sessionService.get(session => session.loggedUser);
  }

  public ngOnInit() {
    this.loggedUser$
      .pipe(takeUntilDestroyed(this))
      .subscribe(user => this.loggedUser = user);
  }

  public ngOnDestroy() { }

  public login() {
    this.loginPopupService.openDialog();
  }

  public logout() {
    this.sessionService.clear();
  }
}
