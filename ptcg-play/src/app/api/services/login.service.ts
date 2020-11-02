import { Injectable } from '@angular/core';
import { ApiErrorEnum } from 'ptcg-server';
import { map, switchMap, catchError, timeout, filter, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { ApiError } from '../api.error';
import { ApiService } from '../api.service';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { CardsService } from './cards.service';
import { LoginResponse, InfoResponse } from '../interfaces/login.interface';
import { MessageService } from './message.service';
import { ProfileService } from './profile.service';
import { SessionService } from '../../shared/session/session.service';
import { SocketService } from '../socket.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoginService {

  constructor(
    private api: ApiService,
    private cardsBaseService: CardsBaseService,
    private cardsService: CardsService,
    private messageService: MessageService,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) {}

  public login(name: string, password: string, loginAborted$: Observable<void>): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/v1/login', { name, password }).pipe(
      takeUntil(loginAborted$),
      switchMap(response => this.processLoginResponse(response, loginAborted$))
    );
  }

  public tokenLogin(token: string, loginAborted$: Observable<void>): Observable<LoginResponse> {
    this.sessionService.session.authToken = token;
    return this.api.get<LoginResponse>('/v1/login/refreshToken').pipe(
      takeUntil(loginAborted$),
      switchMap(response => this.processLoginResponse(response, loginAborted$))
    );
  }

  private processLoginResponse(response: LoginResponse, loginAborted$: Observable<void>): Observable<LoginResponse> {
    this.sessionService.session.authToken = response.token;

    const apiVersion = response.config.apiVersion;
    if (environment.apiVersion !== apiVersion) {
      throw new ApiError(ApiErrorEnum.UNSUPPORTED_VERSION);
    }

    return combineLatest([
      this.profileService.getMe(),
      this.messageService.getConversations(),
      this.cardsService.getAll(),
      this.waitForSocketConnection(response.token)
    ]).pipe(
      takeUntil(loginAborted$),
      catchError(error => {
        this.sessionService.session.authToken = '';
        throw error;
      }),
      map(([me, conversations, cards]) => {

        // Fetch logged user data
        const users = { ...this.sessionService.session.users };
        users[me.user.userId] = me.user;
        this.sessionService.set({
          users,
          loggedUserId: me.user.userId,
        });

        // Fetch user's conversations
        this.messageService.setSessionConversations(
          conversations.conversations,
          conversations.users
        );

        // Fetch cards data
        this.cardsBaseService.setCards(cards.cards);

        // Store data in the session
        this.sessionService.set({
          authToken: response.token,
          config: response.config,
        });

        return response;
    }));
  }

  private waitForSocketConnection(token: string): Observable<boolean> {
    this.socketService.enable(token);
    return this.socketService.connection.pipe(
      filter(connected => connected),
      timeout(environment.timeout),
      catchError(error => {
        this.socketService.disable();
        throw error;
      }));
  }

  public register(name: string, password: string, email: string, code?: string) {
    return this.api.post<LoginResponse>(
      '/v1/login/register', { name, password, email, serverPassword: code });
  }

  public info(): Observable<InfoResponse> {
    return this.api.get<InfoResponse>('/v1/login/info');
  }

  public refreshToken(): Observable<LoginResponse> {
    return this.api.get<LoginResponse>('/v1/login/refreshToken');
  }

  public logout(): void {
    this.sessionService.clear();
  }

}
