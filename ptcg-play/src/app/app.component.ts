import { Component, OnDestroy, OnInit, HostListener, ElementRef } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { ProfileService } from './api/services/profile.service';
import { SessionService } from './shared/session/session.service';
import { SocketService } from './api/socket.service';
import { takeUntilDestroyed } from './shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public isLoggedIn = false;
  public loggedUser: UserInfo | undefined;
  private authToken$: Observable<string>;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private socketService: SocketService,
  ) {
    this.authToken$ = this.sessionService.get(session => session.authToken);
    setTimeout(() => this.onResize());
  }

  public ngOnInit() {
    // Connect to websockets after when logged in
    this.authToken$
      .pipe(takeUntilDestroyed(this))
      .subscribe(authToken => {
        this.isLoggedIn = !!authToken;

        // Connect to websockets
        if (this.isLoggedIn && !this.socketService.isEnabled) {
          this.socketService.enable(authToken);
        }
        if (!this.isLoggedIn && this.socketService.isEnabled) {
          this.socketService.disable();
        }

        // Refresh user profile when user logs in
        this.refreshLoggedUser(authToken);
      });
  }

  public ngOnDestroy() { }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const element = this.elementRef.nativeElement;
    const toolbarHeight = 64;
    const contentHeight = element.offsetHeight - toolbarHeight;
    const cardAspectRatio = 1.37;
    const padding = 16;
    const cardHeight = (contentHeight - (padding * 5)) / 7;
    let cardSize = Math.floor(cardHeight / cardAspectRatio);
    cardSize = Math.min(Math.max(cardSize, 50), 100);
    element.style.setProperty('--card-size', cardSize + 'px');
  }

  private refreshLoggedUser(authToken: string) {
    if (!authToken) {
      this.sessionService.set({ loggedUser: undefined });
      return;
    }

    const tokenChanged$ = this.authToken$.pipe(skip(1));
    this.profileService.getMe()
    .pipe(
        takeUntilDestroyed(this),
        takeUntil(tokenChanged$)
      )
      .subscribe(response => {
        this.sessionService.set({ loggedUser: response.user });
      });
  }

}
