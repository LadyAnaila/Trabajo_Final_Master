import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckService } from '../../../services/deck.service';
import { Deck } from '../../../models/deck.model';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-decks',
  templateUrl: './my-decks.component.html',
  styleUrls: ['./my-decks.component.css'],
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
})
export class MyDecksComponent implements OnInit {
decks: (Deck & { cardsPreview?: { card_code: string, quantity: number }[] })[] = [];

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.loadDecks();
  }

loadDecks() {
  const token = localStorage.getItem('token');
  if (token) {
    this.deckService.getUserDecks(token).subscribe({
      next: (decks) => {
        this.decks = decks.map(deck => ({ ...deck, cardsPreview: [] })); // <-- inicializa cardsPreview
        this.decks.forEach(deck => {
          this.deckService.getDeckCards(deck.id, token).subscribe(cards => {
            deck.cardsPreview = cards;
          });
        });
      },
      error: (err) => console.error('Error al cargar decks:', err)
    });
  }
}

deleteDeck(deckId: number) {
  if (window.confirm('¿Estás seguro de que quieres borrar este mazo? Esta acción no se puede deshacer.')) {
    const token = localStorage.getItem('token');
    if (token) {
      this.deckService.deleteDeck(deckId, token).subscribe({
        next: () => this.loadDecks(),
        error: (err) => console.error('Error al borrar deck:', err)
      });
    }
  }
}

}