import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeckComponent } from './deck/deck.component';
import { GamesComponent } from './games/games.component';
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

const routes: Routes = [
    { path: 'deck', component: DeckComponent },
    { path: 'games', component: GamesComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: '', redirectTo: '/games', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
