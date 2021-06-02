import { LessThan, Not, In } from "typeorm";

import { Scheduler } from "../../utils";
import { config } from "../../config";
import { Match, User } from "../../storage";
import { Core } from "../core/core";

export class CleanerTask {

  private core: Core;

  constructor(core: Core) {
    this.core = core;
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
      await User.delete({
        id: Not(In(onlineUserIds)),
        lastSeen: LessThan(yesterday),
        registered: LessThan(yesterday),
        ranking: 0
      });
    }, config.core.keepUserIntervalCount);
  }

}
