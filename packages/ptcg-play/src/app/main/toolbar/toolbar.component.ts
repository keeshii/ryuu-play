import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserInfo } from '@ryuu-play/ptcg-server';
import { map } from 'rxjs/operators';

import { LoginPopupService } from '../../login/login-popup/login-popup.service';
import { LoginRememberService } from '../../login/login-remember.service';
import { SessionService } from '../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() logoClick = new EventEmitter<void>();

  private loggedUser$: Observable<UserInfo | undefined>;
  public loggedUser: UserInfo | undefined;

  constructor(
    private loginPopupService: LoginPopupService,
    private loginRememberService: LoginRememberService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.loggedUser$ = this.sessionService.get(
      session => session.loggedUserId,
      session => session.users
    ).pipe(map(([loggedUserId, users]) => {
      return users[loggedUserId];
    }));
  }

  public ngOnInit() {
    this.loggedUser$
      .pipe(untilDestroyed(this))
      .subscribe(user => this.loggedUser = user);
  }

  public login() {
    this.loginPopupService.openDialog();
  }

  public logout() {
    this.loginRememberService.rememberToken();
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }

  public onLogoClick() {
    this.logoClick.emit();
  }

}
