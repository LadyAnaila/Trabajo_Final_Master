import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deck } from '../models/deck.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private apiUrl = 'http://localhost:5000/api/decks';

  constructor(private http: HttpClient) {}

  getUserDecks(token: string) {
    return this.http.get<any[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  saveDeck(nombre: string, cartas: { card_code: string, quantity: number }[], token: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { name: nombre, cards: cartas },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

getDeck(deckId: number, token: string): Observable<Deck> {
  return this.http.get<Deck>(`${this.apiUrl}/${deckId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

  getDeckCards(deckId: number, token: string) {
  return this.http.get<{ card_code: string, quantity: number }[]>(
      `${this.apiUrl}/${deckId}/cards`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

updateDeck(deckId: number, nombre: string, cartas: { card_code: string, quantity: number }[], token: string) {
  return this.http.put(
    `${this.apiUrl}/${deckId}`,
    { name: nombre, cards: cartas },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}


deleteDeck(deckId: number, token: string) {
  return this.http.delete(`${this.apiUrl}/${deckId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
}