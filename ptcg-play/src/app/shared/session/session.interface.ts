import { GameInfo, GameState, ClientInfo, UserInfo, StateLog, ServerConfig,
  Replay, State, ConversationInfo } from 'ptcg-server';
import { Observable } from 'rxjs';

export class Session {
  authToken: string;
  config: ServerConfig;
  loggedUserId: number;
  clientId: number;
  games: GameInfo[] = [];
  clients: ClientInfo[] = [];
  users: UserInfoMap = {};
  lastGameId: number;
  gameStates: LocalGameState[] = [];
  conversations: ConversationInfo[] = [];
}

export interface LocalGameState extends GameState {
  localId: number;
  deleted: boolean;
  gameOver: boolean;
  switchSide: boolean;
  promptMinimized: boolean;
  state: State;
  logs: StateLog[];
  replayPosition: number;
  replay?: Replay;
}

export interface UserInfoMap {
  [userId: number]: UserInfo;
}

export interface SessionGetters {
  get<T>(selector: (session: Session) => T): Observable<T>;
  get<T, R>(s1: (session: Session) => T, s2: (session: Session) => R): Observable<[T, R]>;
  get<T, R, S>(s1: (session: Session) => T, s2: (session: Session) => R, s3: (session: Session) => S): Observable<[T, R, S]>;
}
