import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { promisify } from 'util';
import { unlink } from 'fs';
import { join } from 'path';

import { Match, User, Deck, Replay, Avatar, Conversation } from '../../storage';
import { config } from '../../config';

export class DeleteUserTask {

  constructor() { }

  @Transaction()
  private async deleteUserFromDb(userId: number, @TransactionManager() manager?: EntityManager): Promise<Avatar[]> {
    if (manager === undefined) {
      return [];
    }
    // decks
    await manager.delete(Deck, { user: { id: userId } });
    // replays
    await manager.delete(Replay, { user: { id: userId } });
    // conversations
    await manager.delete(Conversation, { user1: { id: userId } });
    await manager.delete(Conversation, { user2: { id: userId } });
    // matches
    await manager.delete(Match, { player1: { id: userId } });
    await manager.delete(Match, { player2: { id: userId } });

    // avatars
    const avatars = await manager.find(Avatar, { user: { id: userId }});
    await manager.delete(Avatar, { user: { id: userId }});

    // user
    await manager.delete(User, { id: userId });

    return avatars;
  }

  public async deleteUser(userId: number) {
    const unlinkAsync = promisify(unlink);

    try {
      // delete user with all dependencies
      const avatars = await this.deleteUserFromDb(userId);

      // remove avatar files from disk
      for (let i = 0; i < avatars.length; i++) {
        const path = join(config.backend.avatarsDir, avatars[i].fileName);
        await unlinkAsync(path);
      }
    } catch (error) {
      // continue regardless of error
    }
  }

}
