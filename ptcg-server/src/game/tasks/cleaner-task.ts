import { LessThan } from 'typeorm';

import { Core } from '../core/core';
import { DeleteUserTask } from './delete-user-task';
import { Match, User } from '../../storage';
import { Scheduler } from '../../utils';
import { config } from '../../config';

export class CleanerTask {

  private core: Core;
  private deleteUserTask: DeleteUserTask;

  constructor(core: Core) {
    this.core = core;
    this.deleteUserTask = new DeleteUserTask();
  }

  public startTasks() {
    this.startOldMatchDelete();
    this.startOldUsersDelete();
  }

  private startOldMatchDelete() {
    const scheduler = Scheduler.getInstance();
    scheduler.run(async () => {
      const keepMatchTime = config.core.keepMatchTime;
      const today = Date.now();
      const yesterday = today - keepMatchTime;
      await Match.delete({ created: LessThan(yesterday) });
    }, config.core.keepMatchIntervalCount);
  }

  // Remove inactive users with ranking equals 0.
  private startOldUsersDelete() {
    const scheduler = Scheduler.getInstance();
    scheduler.run(async () => {
      const keepMatchTime = config.core.keepUserTime;
      const today = Date.now();
      const yesterday = today - keepMatchTime;
      const onlineUserIds = this.core.clients.map(c => c.user.id);
      const usersToDelete = await User.find({
        lastSeen: LessThan(yesterday),
        registered: LessThan(yesterday),
        ranking: 0
      });
      for (let i = 0; i < usersToDelete.length; i++) {
        const userId = usersToDelete[i].id;
        if (!onlineUserIds.includes(userId)) {
          await this.deleteUserTask.deleteUser(userId);
        }
      }
    }, config.core.keepUserIntervalCount);
  }

}
