import { LobbyRoom } from './lobby-room';
import { User } from '../../storage';

describe('LobbyRoom', () => {

  let lobbyRoom: LobbyRoom;
  let user: User;

  beforeEach(() => {
    lobbyRoom = new LobbyRoom();

    user = new User();
    user.id = 1;
    user.name = 'test';
  });

  it('Should create table', () => {
    // given
    const client = lobbyRoom.join(user);
    // when
    const game = lobbyRoom.createGame(client);
    // then
    expect(game).toBeDefined();
    expect(game.room.id).toBeGreaterThan(0);
  });

  it('Should assign new different id to tables', () => {
    // given
    const client = lobbyRoom.join(user);
    // when
    const game = lobbyRoom.createGame(client);
    const game2 = lobbyRoom.createGame(client);
    // then
    expect(game.room.id).not.toEqual(game2.room.id);
  });

  it('Should remove game when no connections', () => {
    // given
    const client = lobbyRoom.join(user);
    // when
    const game = lobbyRoom.createGame(client);
    game.leave();
    const game2 = lobbyRoom.getGame(game.room.id);
    // then
    expect(game).toBeDefined();
    expect(game2).not.toBeDefined();
  });

});
