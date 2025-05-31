import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeckService } from '../../../services/deck.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Deck } from '../../../models/deck.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
})
export class DeckDetailComponent implements OnInit {
  deckId!: number;
  deck: Deck | null = null;
  deckCards: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.deckId = Number(this.route.snapshot.paramMap.get('id'));
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token && this.deckId) {
      // Cargar info del mazo
      this.deckService.getDeck(this.deckId, token).subscribe({
        next: (deck: Deck) => {
          console.log('Deck recibido:', deck);
          this.deck = deck;
        }
      });

      // Cargar cartas del mazo
      this.deckService.getDeckCards(this.deckId, token).subscribe({
        next: cards => {
          const codes = cards.map(c => c.card_code).join(',');
          if (codes) {
            this.http.get<any[]>(`https://arkhamdb.com/api/public/cards/?code=${codes}`).subscribe(apiCards => {
              this.deckCards = cards.map(c => ({
                ...apiCards.find(apiC => apiC.code === c.card_code),
                quantity: c.quantity
              }));
              this.loading = false;
            });
          } else {
            this.deckCards = [];
            this.loading = false;
          }
        },
        error: () => this.loading = false
      });
    }
  }

  // Eliminar mazo
  deleteDeck() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token && this.deckId) {
      if (confirm('¿Seguro que quieres eliminar este mazo?')) {
        this.deckService.deleteDeck(this.deckId, token).subscribe({
          next: () => this.router.navigate(['/cards/my-decks']),
          error: () => alert('Error al eliminar el mazo')
        });
      }
    }
  }

  // Editar mazo
  editDeck() {
    this.router.navigate(['/cards/deckbuilder'], { queryParams: { deckId: this.deckId } });
  }


}