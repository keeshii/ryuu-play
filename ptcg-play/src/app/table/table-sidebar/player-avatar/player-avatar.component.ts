import { Component, Input } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { takeUntil } from 'rxjs/operators';

import { AvatarService } from '../../../api/services/avatar.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss']
})
export class PlayerAvatarComponent {

  @Input() set user(user: UserInfo | undefined) {
    this.userValue = user;
    this.updateAvatar();
  }
  @Input() set avatarName(name: string) {
    this.name = name;
    this.updateAvatar();
  }

  @Input() allowClick: boolean;

  public nextRequest = new Subject<void>();
  public avatarFile = '';
  private userValue: UserInfo | undefined;
  private name: string | undefined;

  constructor(
    private avatarService: AvatarService
  ) { }

  private updateAvatar() {
    const user = this.userValue;
    if (user === undefined || this.name === undefined) {
      this.avatarFile = '';
      return;
    }

    if (this.name === '') {
      this.avatarFile = user.avatarFile;
      return;
    }

    this.nextRequest.next();

    this.avatarService.find(user.userId, this.name).pipe(
      takeUntil(this.nextRequest),
      untilDestroyed(this)
    ).subscribe({
      next: response => {
        this.avatarFile = response.avatar.fileName;
      },
      error: () => {
        this.avatarFile = user.avatarFile;
      }
    });
  }

}
