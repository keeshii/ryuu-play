import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserInfo } from 'ptcg-server';

import { LoginPopupService } from '../../login/login-popup/login-popup.service';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit, OnDestroy {

  private loggedUser$: Observable<UserInfo | undefined>;
  public loggedUser: UserInfo | undefined;

  constructor(
    private loginPopupService: LoginPopupService,
    private router: Router,
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
    this.router.navigate(['/login']);
  }
}
