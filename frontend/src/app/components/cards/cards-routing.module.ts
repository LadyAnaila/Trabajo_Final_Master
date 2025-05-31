import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardListComponent } from './card-list/card-list.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { MyDecksComponent } from './my-decks/my-decks.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: '', component: CardListComponent },
  { path: 'my-decks', component: MyDecksComponent, canActivate: [AuthGuard] },
  { path: 'deckbuilder', component: CardListComponent, data: { selectionMode: true }, canActivate: [AuthGuard] },
  { path: 'decks/:id', component: DeckDetailComponent },
  { path: ':code', component: CardDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule { }