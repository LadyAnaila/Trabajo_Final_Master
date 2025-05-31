import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardService } from '../../../services/card.service';
import { DeckService } from '../../../services/deck.service';
import { Card } from '../../../models/card.model';
import { Router } from '@angular/router';


import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';




@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatExpansionModule, 
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
    MatIconModule, 
    MatTooltipModule
  ]
})
export class CardListComponent implements OnInit {

//////////////////////////
////////General/////////// 
//////////////////////////

  cards: Card[] = [];
  allCards: Card[] = [];
  pagedCards: Card[] = [];
  pageSize = 10;
  pageIndex = 0;

  @Input() selectionMode: boolean = false;
  @Output() cardSelected = new EventEmitter<Card>();

  selectedCards: { card_code: string, quantity: number }[] = [];
  deckName: string = '';

//////////////////////////
/// FILTROS Y OPCIONES
//////////////////////////

  filters = {
    type_code: '',
    faction_code: '',
    name: ''
  };

  cardTypes: { code: string, name: string }[] = [];
  factions: { code: string, name: string }[] = [];

//////////////////////////
/// VISTA Y EXPANSIÓN/////
//////////////////////////

  viewMode: 'cards' | 'list' = 'cards';
  expandedRows: { [code: string]: boolean } = {};

//////////////////////////
/// CONSTRUCTOR///////////
//////////////////////////

  constructor(
    private cardService: CardService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private http: HttpClient, 
    private router: Router 
  ) {}

//////////////////////////
/// INICIALIZACIÓN ///////
//////////////////////////

  ngOnInit(): void {
    const routeSelectionMode = this.route.snapshot.data['selectionMode'];
    if (routeSelectionMode !== undefined) {
      this.selectionMode = routeSelectionMode;
    }

    this.http.get<any[]>('https://arkhamdb.com/api/public/factions/').subscribe(data => {
      this.factions = data.map(f => ({
        code: f.code,
        name: f.name
      }));
    });

    this.cardService.getAllCards().subscribe(cards => {
      this.allCards = cards;
      this.cards = cards;
      this.updatePagedCards();
      const typeSet = new Set(cards.map(c => c.type_code));
      this.cardTypes = Array.from(typeSet).map(code => ({
        code,
        name: code.charAt(0).toUpperCase() + code.slice(1)
      }));
    });

    ///////////// EDICIÓN DE MAZO //////////////
    this.route.queryParamMap.subscribe(params => {
      const deckId = params.get('deckId');
      if (deckId) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        this.deckService.getDeck(Number(deckId), token!).subscribe(deck => {
          this.deckName = deck.name;
          this.deckService.getDeckCards(Number(deckId), token!).subscribe(cards => {
            this.selectedCards = cards.map(c => ({
              card_code: c.card_code,
              quantity: c.quantity
            }));
          });
        });
      }
    });
  }

//////////////////////////
/// CAMBIO DE VISTA//////
//////////////////////////

  setViewMode(mode: 'cards' | 'list') {
    this.viewMode = mode;
  }

//////////////////////////
/// FILTROS//////////////
//////////////////////////

  applyFilters() {
    this.cards = this.allCards.filter(card => {
      const matchesType = !this.filters.type_code || card.type_code === this.filters.type_code;
      const matchesFaction = !this.filters.faction_code || card.faction_code === this.filters.faction_code;
      const matchesName = !this.filters.name || card.name.toLowerCase().includes(this.filters.name.toLowerCase());
      return matchesType && matchesFaction && matchesName;
    });
    this.pageIndex = 0;
    this.updatePagedCards();
  }

  clearFilters() {
    this.filters = { type_code: '', faction_code: '', name: '' };
    this.applyFilters();
  }

//////////////////////////
////// PAGINACIÓN/////////
//////////////////////////

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedCards();
  }

  updatePagedCards() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCards = this.cards.slice(start, end);
  }

//////////////////////////
////CArtas del MAZO///////
//////////////////////////

  addToDeck(card: Card) {
    const existing = this.selectedCards.find(c => c.card_code === card.code);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.selectedCards.push({ card_code: card.code, quantity: 1 });
    }
    this.cardSelected.emit(card);
  }

  incrementCard(sel: { card_code: string, quantity: number }) {
    sel.quantity += 1;
  }

  decrementCard(sel: { card_code: string, quantity: number }) {
    if (sel.quantity > 1) {
      sel.quantity -= 1;
    } else {
      this.selectedCards = this.selectedCards.filter(c => c.card_code !== sel.card_code);
    }
  }

  isSelected(card: Card): boolean {
    return this.selectedCards.some(c => c.card_code === card.code);
  }

  getCardQuantity(cardCode: string): number {
    const found = this.selectedCards.find(c => c.card_code === cardCode);
    return found ? found.quantity : 0;
  }

//////////////////////////
/////GUARDAR MAZO/////////
//////////////////////////


saveDeck() {
  const token = localStorage.getItem('token');
  if (!this.deckName || this.selectedCards.length === 0 || !token) {
    alert('Debes poner nombre y añadir cartas al mazo.');
    return;
  }
  this.deckService.saveDeck(this.deckName, this.selectedCards, token).subscribe({
    next: res => {
      alert('¡Mazo guardado con éxito!');
      // Redirige al detalle del mazo usando el id devuelto por el backend
      if (res.deck_id) {
        this.router.navigate(['/cards/decks', res.deck_id]);
      }
      this.deckName = '';
      this.selectedCards = [];
    },
    error: err => alert('Error al guardar el mazo')
  });
}

//////////////////////////
/////////Otros ///////////
//////////////////////////

  getCardName(card_code: string): string {
    const card = this.allCards.find(c => c.code === card_code);
    return card ? card.name : card_code;
  }

  getTotalCards(): number {
    return this.selectedCards.reduce((sum, c) => sum + c.quantity, 0);
  }
}