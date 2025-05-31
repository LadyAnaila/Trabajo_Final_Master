import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardListComponent } from './card-list.component';
import { CardDetailComponent } from '../card-detail/card-detail.component';

const routes: Routes = [
  { path: '', component: CardListComponent },
  { path: 'card/:code', component: CardDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardListRoutingModule { }