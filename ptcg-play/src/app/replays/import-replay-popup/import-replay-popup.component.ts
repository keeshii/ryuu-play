import { Component, OnInit } from '@angular/core';
import { Replay, GameWinner } from 'ptcg-server';

import { FileInput } from '../../shared/file-input/file-input.model';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-import-replay-popup',
  templateUrl: './import-replay-popup.component.html',
  styleUrls: ['./import-replay-popup.component.scss']
})
export class ImportReplayPopupComponent implements OnInit {

  public GameWinner = GameWinner;
  public loading = false;
  public invalidName: string;
  public replayFile: FileInput;
  public name: string;
  public replayError: string;
  public maxFileSize: number;
  public replay: Replay | undefined;

  constructor(
    private sessionService: SessionService
  ) {
    this.maxFileSize = this.sessionService.session.config.avatarFileSize;
  }

  ngOnInit(): void {
  }

  public updatePreview(value: FileInput) {
    if (value === null || value.files.length === 0) {
      this.replayError = '';
      this.replay = undefined;
      return;
    }

    const file = value.files[0];

    // handled by different validator
    if (file.size > this.maxFileSize) {
      this.replayError = '';
      this.replay = undefined;
      return;
    }

  }

  public importReplay() {
    return;
  }

}
