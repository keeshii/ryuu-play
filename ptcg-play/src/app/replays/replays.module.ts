import { NgModule } from '@angular/core';

import { ReplaysComponent } from './replays.component';
import { SharedModule } from '../shared/shared.module';
import { ImportReplayPopupComponent } from './import-replay-popup/import-replay-popup.component';

@NgModule({
    declarations: [
        ReplaysComponent,
        ImportReplayPopupComponent
    ],
    imports: [
        SharedModule
    ]
})
export class ReplaysModule { }
