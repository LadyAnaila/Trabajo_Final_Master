import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsRoutingModule } from './cards-routing.module';
import { CardListComponent } from './card-list/card-list.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { MyDecksComponent } from './my-decks/my-decks.component';



@NgModule({
  declarations: [
  ],
  imports: [
        CardListComponent,
    CardDetailComponent,
    MyDecksComponent, 
    CommonModule,
    CardsRoutingModule
  ]
})
export class CardsModule { }