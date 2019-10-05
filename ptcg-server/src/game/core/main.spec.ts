import { Main, MainHandler } from './main';
import { Game, GameHandler } from './game';
import { Prompt } from '../store/promts/prompt';
import { State } from '../store/state/state';
import { User } from '../../storage';

describe('Game', () => {

  let main: Main;
  let user: User;
  let mainHandler: MainHandler;
  let gameHandler: GameHandler;

  beforeEach(() => {
    main = new Main();

    user = new User();
    user.id = 1;
    user.name = 'test';

    mainHandler = {
      onConnect: (user: User) => {},
      onDisconnect: (user: User) => {},
      onGameAdd: (game: Game) => {},
      onGameDelete: (game: Game) => {},
      onGameStatus: (game: Game) => {}
    }
    gameHandler = {
      onJoin: (user: User) => {},
      onLeave: (user: User) => {},
      onStateChange: (state: State) => {},
      resolvePrompt: (prompt: Prompt<any>) => false
    }
  });

  it('Should create table', () => {
    // given
    const connection = main.connect(user, mainHandler);
    // when
    const game = connection.createGame(gameHandler);
    // then
    expect(game).toBeDefined();
    expect(game.id).toBeGreaterThan(0);
  });

  it('Should assign new different id to tables', () => {
    // given
    const connection = main.connect(user, mainHandler);
    // when
    const game = connection.createGame(gameHandler);
    const game2 = connection.createGame(gameHandler);
    // then
    expect(game.id).not.toEqual(game2.id);
  });

  it('Should remove game when no connections', () => {
    // given
    const connection = main.connect(user, mainHandler);
    // when
    const game = connection.createGame(gameHandler);
    const gameRef = connection.getGame(game.id);
    game.leave();
    const gameRef2 = connection.getGame(game.id);
    // then
    expect(gameRef).toBeDefined();
    expect(gameRef2).not.toBeDefined();
  });

});
