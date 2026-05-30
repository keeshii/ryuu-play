# RyuuPlay Code Wiki

## 项目概述

**RyuuPlay** 是一个 Pokémon  Trading Card Game (PTCG) 在线模拟器，使用 TypeScript 完全重写，采用前后端分离架构。项目主要用于测试 AI 机器人实现方法，支持玩家与 AI 对战以及 AI 之间的对战。

### 技术栈

| 模块 | 技术 | 说明 |
|------|------|------|
| 后端 | Node.js + Express | REST API 服务器 |
| 实时通信 | Socket.IO | WebSocket 双向通信 |
| 数据库 | TypeORM + SQLite/MySQL | ORM 数据持久化 |
| 前端 | Angular 12 + Material | 单页应用 |
| 移动端 | Cordova | Android 应用打包 |

---

## 项目架构

```
ryuu-play/
├── ptcg-server/          # 游戏服务器
│   ├── src/
│   │   ├── backend/       # HTTP 控制器和 WebSocket
│   │   ├── game/          # 游戏核心逻辑
│   │   ├── sets/          # 卡牌定义
│   │   ├── storage/        # 数据库模型
│   │   ├── email/          # 邮件服务
│   │   └── utils/          # 工具函数
│   ├── start.js           # 服务器启动入口
│   └── package.json
│
├── ptcg-play/             # Angular 前端应用
│   ├── src/
│   │   └── app/
│   │       ├── api/        # API 服务
│   │       ├── deck/      # 卡组管理
│   │       ├── games/      # 游戏大厅
│   │       ├── table/      # 游戏桌面
│   │       ├── login/      # 登录模块
│   │       ├── messages/  # 消息系统
│   │       ├── profile/    # 用户资料
│   │       ├── ranking/    # 排行榜
│   │       ├── replays/    # 回放系统
│   │       └── shared/     # 共享组件
│   └── package.json
│
├── ptcg-cordova/          # Cordova 移动端包装
├── docker/                 # Docker 配置
└── docker-compose.yml
```

---

## 后端架构 (ptcg-server)

### 核心模块

#### 1. 游戏核心 (Game Core)

**文件**: `src/game/core/`

##### `Core.ts` - 游戏核心管理器

```typescript
export class Core {
  public clients: Client[] = [];
  public games: Game[] = [];
  public messager: Messager;
}
```

**职责**:
- 管理所有连接的客户端
- 管理所有进行中的游戏
- 处理客户端连接/断开
- 创建和管理游戏实例
- 协调 WebSocket 通信

**关键方法**:

| 方法 | 说明 |
|------|------|
| `connect(client)` | 连接新客户端 |
| `disconnect(client)` | 断开客户端连接 |
| `createGame(client, deck, gameSettings, invited?)` | 创建新游戏 |
| `joinGame(client, game)` | 将玩家加入游戏 |
| `leaveGame(client, game)` | 玩家离开游戏 |
| `deleteGame(game)` | 删除游戏实例 |

##### `Game.ts` - 游戏实例

```typescript
export class Game implements StoreHandler {
  public id: number;
  public clients: Client[] = [];
  public playerStats: PlayerStats[] = [];
  private store: Store;
  private arbiter = new Arbiter();
  private matchRecorder: MatchRecorder;
}
```

**职责**:
- 管理单个游戏的状态
- 处理游戏动作分发
- 管理游戏计时器
- 处理玩家超时和断开

**关键方法**:

| 方法 | 说明 |
|------|------|
| `dispatch(client, action)` | 分发玩家动作到 Store |
| `handleClientLeave(client)` | 处理玩家离开 |
| `onStateChange(state)` | 状态变更回调 |

##### `GameSettings.ts` - 游戏配置

```typescript
export class GameSettings {
  public rules: Rules = new Rules();
  public timeLimit: number = 0;
  public recordingEnabled: boolean = true;
}
```

#### 2. 状态管理 (Store)

**文件**: `src/game/store/store.ts`

```typescript
export class Store implements StoreLike {
  public state: State = new State();
  private promptItems: PromptItem[] = [];
}
```

**架构模式**: Redux 风格的单向数据流

**职责**:
- 维护游戏状态树
- 分发动作 (Actions) 触发状态变更
- 管理提示 (Prompts) 处理玩家交互
- 调用 Reducers 处理游戏逻辑

**关键方法**:

| 方法 | 说明 |
|------|------|
| `dispatch(action)` | 分发动作到 Reducers |
| `reduceEffect(state, effect)` | 处理效果 |
| `prompt(state, prompts, callback)` | 显示提示给玩家 |
| `log(state, message, params)` | 记录游戏日志 |

##### `State.ts` - 游戏状态

```typescript
export class State {
  public cardNames: string[] = [];
  public logs: StateLog[] = [];
  public rules: Rules = new Rules();
  public prompts: Prompt<any>[] = [];
  public phase: GamePhase = GamePhase.WAITING_FOR_PLAYERS;
  public turn = 0;
  public activePlayer: number = 0;
  public winner: GameWinner = GameWinner.NONE;
  public players: Player[] = [];
}
```

**GamePhase 枚举**:

```typescript
enum GamePhase {
  WAITING_FOR_PLAYERS,  // 等待玩家
  SETUP,                // 初始化阶段
  PLAYER_TURN,          // 玩家回合
  ATTACK,               // 攻击阶段
  BETWEEN_TURNS,        // 回合间隙
  FINISHED              // 游戏结束
}
```

##### `Player.ts` - 玩家状态

```typescript
export class Player {
  id: number = 0;
  name: string = '';
  deck: CardList = new CardList();      // 卡组
  hand: CardList = new CardList();      // 手牌
  discard: CardList = new CardList();   // 弃牌堆
  stadium: CardList = new CardList();   // 场地卡
  supporter: CardList = new CardList(); // 支援者卡
  active: PokemonCardList = new PokemonCardList(); // 战斗宝可梦
  bench: PokemonCardList[] = [];        // 备用宝可梦
  prizes: CardList[] = [];              // 奖励卡
  marker = new Marker();                // 伤害指示物
  avatarName: string = '';
}
```

#### 3. 动作系统 (Actions)

**文件**: `src/game/store/actions/`

基础动作接口:

```typescript
export interface Action {
  readonly type: string;
}
```

**主要动作类型**:

| 动作 | 说明 |
|------|------|
| `PlayCardAction` | 打出卡牌 (宝可梦/能量/训练家) |
| `AttackAction` | 使用攻击 |
| `RetreatAction` | 撤退 |
| `PassTurnAction` | 结束回合 |
| `UseAbilityAction` | 使用特性 |
| `UseStadiumAction` | 使用场地 |
| `ResolvePromptAction` | 响应提示 |
| `AddPlayerAction` | 添加玩家到游戏 |
| `InvitePlayerAction` | 邀请玩家 |
| `AbortGameAction` | 中断游戏 |

#### 4. 效果系统 (Effects)

**文件**: `src/game/store/effects/`

基础效果接口:

```typescript
export interface Effect {
  readonly type: string;
  preventDefault: boolean;
}
```

**效果分类**:

| 类型 | 说明 | 文件 |
|------|------|------|
| 游戏效果 | `GameEffect` | 攻击、撤退、特性等 |
| 卡牌效果 | 特定卡牌的效果 | 各卡牌实现 |
| 状态检查 | `CheckEffect` | 规则检查 |

#### 5. 提示系统 (Prompts)

**文件**: `src/game/store/prompts/`

```typescript
export abstract class Prompt<T> {
  readonly abstract type: string;
  public id: number;
  public result: T | undefined;
}
```

**提示类型**:

| 提示 | 说明 |
|------|------|
| `ChooseCardsPrompt` | 选择卡牌 |
| `ChoosePokemonPrompt` | 选择宝可梦 |
| `ChooseAttackPrompt` | 选择攻击 |
| `CoinFlipPrompt` | 投硬币 |
| `AttachEnergyPrompt` | 附加能量 |
| `ConfirmPrompt` | 确认操作 |
| `SelectPrompt` | 一般选择 |

#### 6. Reducers

**文件**: `src/game/store/reducers/`

| Reducer | 说明 |
|---------|------|
| `playCardReducer` | 处理打出手牌 |
| `playerTurnReducer` | 处理回合动作 |
| `setupPhaseReducer` | 初始化阶段逻辑 |
| `abortGameReducer` | 游戏中断处理 |
| `playerStateReducer` | 玩家状态变更 |

#### 7. 卡牌系统

**文件**: `src/game/store/card/`

##### `Card.ts` - 卡牌基类

```typescript
export abstract class Card {
  public abstract set: string;
  public abstract superType: SuperType;
  public abstract fullName: string;
  public abstract name: string;
  public id: number = -1;
  public tags: string[] = [];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
```

##### `PokemonCard.ts` - 宝可梦卡

```typescript
export abstract class PokemonCard extends Card {
  public superType: SuperType = SuperType.POKEMON;
  public cardType: CardType = CardType.NONE;
  public pokemonType: PokemonType = PokemonType.NORMAL;
  public evolvesFrom: string = '';
  public stage: Stage = Stage.BASIC;
  public retreat: CardType[] = [];
  public hp: number = 0;
  public weakness: Weakness[] = [];
  public resistance: Resistance[] = [];
  public powers: Power[] = [];
  public attacks: Attack[] = [];
}
```

##### `EnergyCard.ts` - 能量卡

##### `TrainerCard.ts` - 训练家卡

**TrainerType**:

```typescript
enum TrainerType {
  ITEM,      // 道具
  SUPPORTER, // 支援者
  STADIUM,   // 场地
  TOOL       // 工具
}
```

#### 8. 卡牌管理器

**文件**: `src/game/cards/card-manager.ts`

```typescript
export class CardManager {
  private static instance: CardManager;
  private cards: Card[] = [];

  public static getInstance(): CardManager;
  public defineSet(cards: Card[]): void;
  public defineCard(card: Card): void;
  public getCardByName(name: string): Card | undefined;
  public getAllCards(): Card[];
}
```

**单例模式**: 全局只有一个 CardManager 实例

#### 9. 卡组分析器

**文件**: `src/game/cards/deck-analyser.ts`

验证卡组合法性 (60 张卡、禁止非法卡组等)

### 卡牌定义

**文件位置**: `src/sets/`

卡牌按系列组织:

| 系列 | 目录 |
|------|------|
| Diamond & Pearl | `set-diamond-and-pearl/` |
| HeartGold & SoulSilver | `set-hgss/` |
| Black & White | `set-black-and-white/` |
| Black & White 2 | `set-black-and-white-2/` |
| Black & White 3 | `set-black-and-white-3/` |
| Black & White 4 | `set-black-and-white-4/` |
| Sword & Shield | `set-sword-and-shield/` |

**卡牌定义示例** (`emboar.ts`):

```typescript
export class Emboar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pignite';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 150;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Inferno Fandango',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn...'
  }];

  public attacks = [{
    name: 'Heat Crash',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // 特性效果实现
  }
}
```

### 序列化系统

**文件**: `src/game/serializer/`

**StateSerializer** 负责:
- 游戏状态序列化和反序列化
- JSON Patch 用于增量更新
- 引用共享对象处理

**关键方法**:

```typescript
export class StateSerializer {
  public serialize(state: State): SerializedState;
  public deserialize(serializedState: SerializedState): State;
  public serializeDiff(base, state): SerializedState;
  public deserializeDiff(base, data): State;
}
```

### Bot 系统

**文件**: `src/game/bots/`

#### `Simulator.ts` - 状态模拟器

用于 AI 评估游戏状态:

```typescript
export class Simulator implements StoreHandler {
  public store: Store;
  private botArbiter: BotArbiter;

  constructor(state: State, options?);
  public clone(): Simulator;
  public dispatch(action: Action): State;
}
```

#### `BotManager.ts` - Bot 管理器

```typescript
export class BotManager {
  private bots: Bot[] = [];

  public static getInstance(): BotManager;
  public registerBot(bot: Bot): void;
  public initBots(core: Core): void;
}
```

#### `BotGamesTask.ts` - 自动对战任务

定时触发 Bot 之间的对战

### 后端控制器

**文件**: `src/backend/controllers/`

| 控制器 | 路径 | 说明 |
|--------|------|------|
| `Login` | `/v1/login` | 登录、注册、令牌刷新 |
| `Decks` | `/v1/decks` | 卡组 CRUD |
| `Cards` | `/v1/cards` | 获取可用卡牌列表 |
| `Profile` | `/v1/profile` | 用户资料管理 |
| `Ranking` | `/v1/ranking` | 排行榜 |
| `Messages` | `/v1/messages` | 玩家消息 |
| `Replays` | `/v1/replays` | 回放管理 |
| `Game` | `/v1/game` | 游戏状态查询 |
| `Avatars` | `/v1/avatars` | 头像管理 |
| `ResetPassword` | `/v1/resetPassword` | 密码重置 |

#### `Login.ts` 关键端点

```typescript
@Post('/register')   // 用户注册
@Post('')             // 登录
@Get('/refreshToken') // 刷新令牌
@Get('/logout')       // 登出
@Get('/info')         // 获取服务器配置
```

### WebSocket 通信

**文件**: `src/backend/socket/`

#### `WebSocketServer.ts`

```typescript
export class WebSocketServer {
  public server: Server | undefined;

  public async listen(httpServer: http.Server): Promise<void>;
}
```

#### `GameSocket.ts` - 游戏事件处理

**事件列表**:

| 事件 | 方向 | 说明 |
|------|------|------|
| `game:join` | C→S | 加入游戏 |
| `game:leave` | C→S | 离开游戏 |
| `game:getStatus` | C→S | 获取游戏状态 |
| `game:action:attack` | C→S | 攻击 |
| `game:action:playCard` | C→S | 出牌 |
| `game:action:retreat` | C→S | 撤退 |
| `game:action:passTurn` | C→S | 结束回合 |
| `game:action:resolvePrompt` | C→S | 响应提示 |
| `game:stateChange` | S→C | 状态变更通知 |
| `game:join` | S→C | 玩家加入通知 |

### 数据存储

**文件**: `src/storage/`

使用 TypeORM 进行数据库操作。

#### 数据模型

##### `User.ts`

```typescript
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() email: string;
  @Column() ranking: number;
  @Column() password: string;
  @Column() registered: number;
  @Column() lastSeen: number;
  @Column() avatarFile: string;

  @OneToMany(() => Deck, deck => deck.user) decks;
  @OneToMany(() => Avatar, avatar => avatar.user) avatars;
  @OneToMany(() => Replay, replay => replay.user) replays;

  public getRank(): Rank;
  public updateLastSeen(): Promise<this>;
}
```

##### `Deck.ts`

```typescript
@Entity()
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => User, user => user.decks) user: User;
  @Column() name: string;
  @Column({ type: 'text' }) cards: string;
  @Column() isValid: boolean;
  @Column() cardTypes: string;
}
```

##### 其他模型

| 模型 | 说明 |
|------|------|
| `Message` | 玩家间消息 |
| `Replay` | 游戏回放 |
| `Match` | 对战记录 |
| `Avatar` | 用户头像 |

### 配置系统

**文件**: `src/config.ts`

```typescript
export const config = {
  backend: {
    address: 'localhost',
    port: 12021,
    serverPassword: '',
    registrationEnabled: true,
    allowCors: true,
    secret: '!secret!',
    tokenExpire: 86400,
    // ...
  },
  storage: {
    type: 'mysql',  // 或 'sqlite'
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'ptcg'
  },
  core: {
    debug: false,
    schedulerInterval: 15 * 60 * 1000,
    rankingDecraseRate: 0.95,
    // ...
  },
  bots: {
    defaultPassword: '',
    actionDelay: 250,
    botGamesIntervalCount: 0
  },
  email: {
    transporter: { sendmail: true },
    sender: 'example@example.com',
    appName: 'RyuuPlay'
  }
};
```

### 服务器启动

**文件**: `start.js`

```javascript
const cardManager = CardManager.getInstance();

// 定义可用卡牌系列
cardManager.defineSet(sets.setDiamondAndPearl);
cardManager.defineSet(sets.setOp9);
cardManager.defineSet(sets.setBlackAndWhite);
// ...

StateSerializer.setKnownCards(cardManager.getAllCards());

const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));

const app = new App();
app.connectToDatabase()
  .then(() => app.configureBotManager(botManager))
  .then(() => app.start());
```

---

## 前端架构 (ptcg-play)

### Angular 模块结构

```
AppModule
├── ApiModule
├── DeckModule
├── GamesModule
├── LoginModule
├── MainModule
├── MessagesModule
├── ProfileModule
├── RankingModule
├── ReplaysModule
├── SharedModule
└── TableModule
```

### 核心服务

#### `ApiService`

**文件**: `src/app/api/api.service.ts`

```typescript
@Injectable()
export class ApiService {
  public get<T>(uri: string): Observable<T>;
  public post<T>(uri: string, body: any): Observable<T>;
  public getServerInfo(apiUrl: string): Observable<InfoResponse>;
}
```

#### `SocketService`

**文件**: `src/app/api/socket.service.ts`

```typescript
@Injectable()
export class SocketService {
  public socket: Socket;
  public connection: Observable<boolean>;

  public enable(authToken: string): void;
  public disable(): void;
  public emit<T, R>(message: string, data?: T): Observable<R>;
  public on<T>(event: string, fn: (data: T) => void): void;
  public off(message?: string): void;

  get isEnabled(): boolean;
  get isConnected(): boolean;
}
```

#### `SessionService`

管理用户会话状态:

```typescript
@Injectable()
export class SessionService {
  public session: Session;
  public get<T>(...keys: string[]): Observable<T>;
  public set(session: Partial<Session>): void;
  public clear(): void;
}
```

### 路由配置

**文件**: `src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  { path: 'deck', component: DeckComponent, canActivate: [CanActivateService] },
  { path: 'deck/:deckId', component: DeckEditComponent, canActivate: [CanActivateService] },
  { path: 'games', component: GamesComponent, canActivate: [CanActivateService] },
  { path: 'login', component: LoginComponent },
  { path: 'message/:userId', component: MessagesComponent, canActivate: [CanActivateService] },
  { path: 'ranking', component: RankingComponent, canActivate: [CanActivateService] },
  { path: 'replays', component: ReplaysComponent, canActivate: [CanActivateService] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [CanActivateService] },
  { path: 'table/:gameId', component: TableComponent, canActivate: [CanActivateService] },
  { path: '', redirectTo: '/games', pathMatch: 'full' }
];
```

### 主要组件

#### `TableComponent` - 游戏桌面

**文件**: `src/app/table/table.component.ts`

显示游戏状态，处理玩家交互:

- 展示双方玩家的手牌、场上宝可梦、奖励卡等
- 处理打牌、攻击、撤退等动作
- 显示提示等待玩家选择

#### `GamesComponent` - 游戏大厅

**文件**: `src/app/games/games.component.ts`

- 显示所有进行中的游戏
- 创建新游戏
- 邀请其他玩家对战

#### `DeckComponent` - 卡组管理

**文件**: `src/app/deck/deck.component.ts`

- 列出用户的卡组
- 创建、编辑、删除卡组
- 复制卡组

### 共享组件

**文件**: `src/app/shared/`

| 组件 | 说明 |
|------|------|
| `AlertService` | 提示对话框 |
| `SessionService` | 会话管理 |
| `MaterialModule` | Material 组件导出 |

### 环境配置

**文件**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:12021',
  refreshTokenInterval: 60000,
  timeout: 30000
};
```

---

## 依赖关系图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (ptcg-play)                      │
│  Angular 12 + Material + Socket.IO Client + RxJS            │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/WebSocket
┌─────────────────────────▼───────────────────────────────────┐
│                       后端 (ptcg-server)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Express + Socket.IO                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │   │
│  │  │ Controllers│ │ GameSocket│ │AuthToken │ │ Services│  │   │
│  │  └────┬────┘  └────┬────┘  └─────────┘  └─────────┘  │   │
│  │       │            │                                 │   │
│  │       └────────────┼─────────────────────────────────┘   │
│  │                    │                                     │
│  │  ┌─────────────────▼───────────────────────────────┐     │
│  │  │              Game Core (Core.ts)               │     │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │     │
│  │  │  │  Game   │  │  Store  │  │  StateSerializer│  │     │
│  │  │  └────┬────┘  └────┬────┘  └────────┬────────┘  │     │
│  │  │       │            │                │           │     │
│  │  │       ▼            ▼                ▼           │     │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐       │     │
│  │  │  │Actions │  │Reducers │  │  Effects    │       │     │
│  │  │  └────┬────┘  └────┬────┘  └──────┬──────┘       │     │
│  │  │       │            │               │              │     │
│  │  │       ▼            ▼               ▼              │     │
│  │  │  ┌─────────────────────────────────────────┐      │     │
│  │  │  │               State                      │      │     │
│  │  │  │  Players, Cards, Prompts, Logs         │      │     │
│  │  │  └─────────────────────────────────────────┘      │     │
│  │  └──────────────────────────────────────────────────────┘   │
│  │                                                            │
│  │  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  │   CardManager   │  │   BotManager    │                   │
│  │  │   (卡牌定义)      │  │   (AI 管理)     │                   │
│  │  └────────┬─────────┘  └────────┬────────┘                   │
│  │           │                     │                            │
│  │           ▼                     ▼                            │
│  │  ┌─────────────────────────────────────┐                     │
│  │  │         Card Definitions             │                     │
│  │  │  PokemonCard, TrainerCard, EnergyCard│                     │
│  │  └─────────────────────────────────────┘                     │
│  │                                                            │
│  │  ┌──────────────────────────────────────────────────────┐   │
│  │  │                  TypeORM Storage                      │   │
│  │  │  User, Deck, Message, Replay, Match, Avatar         │   │
│  │  └──────────────────────────────────────────────────────┘   │
│  └──────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│                    数据库 (SQLite/MySQL)                        │
└───────────────────────────────────────────────────────────────┘
```

---

## 项目运行

### 前置条件

- Node.js 8 LTS 或更高版本
- MySQL 5 或 SQLite 3 (或使用 Docker)

### 服务器启动

```bash
cd ptcg-server

# 安装依赖
npm install

# 配置 (编辑 config.js)
cp config.js config.local.js

# 构建
npm run build

# 启动
npm start
# 或开发模式
npm run start:dev
```

服务器默认监听 `http://localhost:12021`

### 前端启动

```bash
cd ptcg-play

# 安装依赖
npm install

# 开发模式启动
npm start
# 访问 http://localhost:4200
```

### Docker 部署

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f ryuu_play
```

---

## API 参考

### 登录接口

#### 注册
```
POST /v1/login/register
Body: { name, email, password, serverPassword? }
Response: { ok: true }
```

#### 登录
```
POST /v1/login
Body: { name, password }
Response: { ok: true, token, config }
```

### 卡组接口

#### 获取卡组列表
```
GET /v1/decks
Headers: Auth-Token
Response: { ok: true, decks: DeckListEntry[] }
```

#### 创建卡组
```
POST /v1/decks
Headers: Auth-Token
Body: { name }
Response: { ok: true, id }
```

#### 获取卡组详情
```
GET /v1/decks/:id
Headers: Auth-Token
Response: { ok: true, deck: Deck }
```

#### 更新卡组
```
PUT /v1/decks/:id
Headers: Auth-Token
Body: { name, cards }
Response: { ok: true }
```

### 游戏接口

#### 创建游戏
```
POST /v1/game
Headers: Auth-Token
Body: { deck: string[], invitedId?, gameSettings? }
Response: { ok: true, gameId }
```

#### 获取游戏列表
```
GET /v1/game/list
Headers: Auth-Token
Response: { ok: true, games, clients }
```

### 排行榜接口

```
GET /v1/ranking/page/:page
Response: { ok: true, ranking: UserRankInfo[] }
```

---

## 数据库表结构

### users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR | 用户名 (唯一) |
| email | VARCHAR | 邮箱 |
| password | VARCHAR | MD5 密码 |
| ranking | INT | 排名分数 |
| registered | BIGINT | 注册时间 |
| lastSeen | BIGINT | 最后在线时间 |
| avatarFile | VARCHAR | 头像文件名 |

### decks
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 所属用户 |
| name | VARCHAR | 卡组名 |
| cards | TEXT | 卡组 JSON |
| isValid | BOOLEAN | 是否有效 |
| cardTypes | VARCHAR | 卡牌类型统计 |

### messages
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| fromId | INT | 发送者 |
| toId | INT | 接收者 |
| message | TEXT | 消息内容 |
| time | BIGINT | 发送时间 |
| seen | BOOLEAN | 是否已读 |

### replays
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 保存者 |
| data | BLOB | 回放数据 |
| created | BIGINT | 创建时间 |

### matches
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| player1Id | INT | 玩家1 |
| player2Id | INT | 玩家2 |
| winnerId | INT | 胜者 |
| data | BLOB | 对战数据 |
| played | BIGINT | 对战时间 |

---

## 配置选项

### 服务器密码
```javascript
config.backend.serverPassword = 'letsplaypokemontcg';
```

### 启用/禁用注册
```javascript
config.backend.registrationEnabled = true;
```

### 数据库配置
```javascript
// SQLite
config.storage.type = 'sqlite';

// MySQL
config.storage.type = 'mysql';
config.storage.host = 'localhost';
config.storage.port = 3306;
config.storage.username = 'root';
config.storage.password = '';
config.storage.database = 'ptcg';
```

### Bot 配置
```javascript
config.bots.botGamesIntervalCount = 4;  // 自动对战间隔
config.bots.actionDelay = 250;          // Bot 动作延迟(ms)
```

### 排名衰减
```javascript
config.core.rankingDecraseRate = 0.95;  // 每日衰减至 95%
```

---

## 开发指南

### 添加新卡牌

1. 在 `src/sets/set-*` 目录下创建新的卡牌文件
2. 继承适当的基类 (`PokemonCard`, `TrainerCard`, `EnergyCard`)
3. 实现 `reduceEffect` 方法处理卡牌效果
4. 在对应系列的 `index.ts` 中导出
5. 在 `start.js` 中调用 `cardManager.defineSet()`

### 添加新提示类型

1. 继承 `Prompt<T>` 基类
2. 实现 `decode` 和 `validate` 方法
3. 在 `src/game/store/prompts/index.ts` 中导出

### 添加新动作类型

1. 创建新的动作类实现 `Action` 接口
2. 在相应的 Reducer 中添加处理逻辑
3. 在 `src/game/store/actions/index.ts` 中导出

---

## 关键类速查

### 后端

| 类 | 文件 | 用途 |
|----|------|------|
| `Core` | `game/core/core.ts` | 游戏核心管理 |
| `Game` | `game/core/game.ts` | 单个游戏实例 |
| `Store` | `game/store/store.ts` | 状态管理 |
| `State` | `game/store/state/state.ts` | 游戏状态 |
| `Card` | `game/store/card/card.ts` | 卡牌基类 |
| `CardManager` | `game/cards/card-manager.ts` | 卡牌管理 |
| `StateSerializer` | `game/serializer/state-serializer.ts` | 状态序列化 |
| `WebSocketServer` | `backend/socket/websocket-server.ts` | WebSocket 服务 |
| `User` | `storage/model/user.ts` | 用户模型 |
| `Deck` | `storage/model/deck.ts` | 卡组模型 |

### 前端

| 类 | 文件 | 用途 |
|----|------|------|
| `ApiService` | `api/api.service.ts` | HTTP 请求 |
| `SocketService` | `api/socket.service.ts` | WebSocket |
| `SessionService` | `shared/session/session.service.ts` | 会话管理 |
| `TableComponent` | `table/table.component.ts` | 游戏桌面 |
| `GamesComponent` | `games/games.component.ts` | 游戏大厅 |
| `DeckComponent` | `deck/deck.component.ts` | 卡组管理 |
