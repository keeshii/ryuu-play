import { Main } from './main';
import { User } from '../../storage';

describe('Game', () => {

  let game: Main;
  let user: User;

  beforeEach(() => {
    game = new Main();

    user = new User();
    user.id = 1;
    user.name = 'test';
  });

  it('Should create table', () => {
    // when
    const table = game.createGame(user);
    // then
    expect(table).toBeDefined();
    expect(table.owner).toBe(user);
  });

  it('Should assign new different id to tables', () => {
    // when
    const table = game.createGame(user);
    const table2 = game.createGame(user);
    // then
    expect(table.id).not.toEqual(table2.id);
  });

});
