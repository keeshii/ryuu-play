import { Component, DestroyRef, inject, Input } from '@angular/core';
import { UserInfo } from '@ptcg/common';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { takeUntil } from 'rxjs/operators';

import { AvatarService } from '../../../api/services/avatar.service';

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
  private destroyRef = inject(DestroyRef);

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
      takeUntilDestroyed(this.destroyRef)
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
