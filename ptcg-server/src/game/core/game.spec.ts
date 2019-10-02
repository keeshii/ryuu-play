import { Game } from './game';
import { User } from '../../storage';

describe('Game', () => {

  let game: Game;
  let user: User;

  beforeEach(() => {
    game = new Game();

    user = new User();
    user.id = 1;
    user.name = 'test';
  });

  it('Should create table', () => {
    // when
    const table = game.createTable(user);
    // then
    expect(table).toBeDefined();
    expect(table.owner).toBe(user);
  });

  it('Should assign new different id to tables', () => {
    // when
    const table = game.createTable(user);
    const table2 = game.createTable(user);
    // then
    expect(table.id).not.toEqual(table2.id);
  });

});
