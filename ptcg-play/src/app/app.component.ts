import { Component, OnDestroy, OnInit, HostListener, ElementRef } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { CardsBaseService } from './shared/cards/cards-base.service';
import { CardsService } from './api/services/cards.service';
import { MessageService } from './api/services/message.service';
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
    private cardsService: CardsService,
    private cardsBaseService: CardsBaseService,
    private elementRef: ElementRef<HTMLElement>,
    private messageService: MessageService,
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
      this.sessionService.set({ loggedUserId: undefined });
      return;
    }

    const tokenChanged$ = this.authToken$.pipe(skip(1));
    this.profileService.getMe()
    .pipe(
        takeUntilDestroyed(this),
        takeUntil(tokenChanged$)
      )
      .subscribe(response => {
        const users = { ...this.sessionService.session.users };
        users[response.user.userId] = response.user;
        this.sessionService.set({ users, loggedUserId: response.user.userId });
      });

    this.messageService.getConversations()
    .pipe(
        takeUntilDestroyed(this),
        takeUntil(tokenChanged$)
      )
      .subscribe(response => {
        this.messageService.setSessionConversations(
          response.conversations,
          response.users
        );
      });

    this.cardsService.getAll()
    .pipe(
        takeUntilDestroyed(this),
        takeUntil(tokenChanged$)
      )
      .subscribe({
        next: response => {
          this.cardsBaseService.setCards(response.cards);
        }
      });
  }

}
