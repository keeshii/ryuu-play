import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateService } from './can-activate.service';
import { DeckComponent } from './deck/deck.component';
import { DeckEditComponent } from './deck/deck-edit/deck-edit.component';
import { GamesComponent } from './games/games.component';
import { LoginComponent } from './login/login/login.component';
import { MessageComponent } from './message/message.component';
import { ProfileComponent } from './profile/profile.component';
import { RankingComponent } from './ranking/ranking.component';
import { RegisterComponent } from './login/register/register.component';
import { ReplaysComponent } from './replays/replays.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
    { path: 'deck', component: DeckComponent, canActivate: [ CanActivateService ] },
    { path: 'deck/:deckId', component: DeckEditComponent, canActivate: [ CanActivateService ] },
    { path: 'games', component: GamesComponent, canActivate: [ CanActivateService ] },
    { path: 'login', component: LoginComponent },
    { path: 'message', redirectTo: 'message/', pathMatch: 'full' },
    { path: 'message/:userId', component: MessageComponent, canActivate: [ CanActivateService ] },
    { path: 'ranking', component: RankingComponent, canActivate: [ CanActivateService ] },
    { path: 'register', component: RegisterComponent },
    { path: 'replays', component: ReplaysComponent, canActivate: [ CanActivateService ] },
    { path: 'profile/:userId', component: ProfileComponent, canActivate: [ CanActivateService ] },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'table/:gameId', component: TableComponent, canActivate: [ CanActivateService ] },
    { path: '', redirectTo: '/games', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
