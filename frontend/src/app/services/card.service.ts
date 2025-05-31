import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';


@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'https://arkhamdb.com/api/public';

  constructor(private http: HttpClient) {}

  getAllCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards/`);
  }

  getCardByCode(code: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/card/${code}`);
  }

  getCardFaq(cardCode: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/faq/${cardCode}.json`);
}

  getFilteredCards(filters: any): Observable<Card[]> {
    let params: any = {};
    if (filters.type_code) params.type_code = filters.type_code;
    if (filters.faction_code) params.faction_code = filters.faction_code;
    if (filters.name) params.name = filters.name;
    return this.http.get<Card[]>(`${this.apiUrl}/cards/`, { params });
  }
}