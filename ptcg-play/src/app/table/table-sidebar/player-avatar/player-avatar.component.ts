import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AvatarService } from '../../../api/services/avatar.service';
import { takeUntilDestroyed } from '../../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss']
})
export class PlayerAvatarComponent implements OnInit, OnDestroy {

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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

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
      takeUntilDestroyed(this)
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
