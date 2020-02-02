import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateService } from './can-activate.service';
import { DeckComponent } from './deck/deck.component';
import { DeckEditComponent } from './deck/deck-edit/deck-edit.component';
import { GamesComponent } from './games/games.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
    { path: 'deck', component: DeckComponent, canActivate: [ CanActivateService ] },
    { path: 'deck/:deckId', component: DeckEditComponent, canActivate: [ CanActivateService ] },
    { path: 'games', component: GamesComponent, canActivate: [ CanActivateService ] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'table/:gameId', component: TableComponent, canActivate: [ CanActivateService ] },
    { path: '', redirectTo: '/games', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
