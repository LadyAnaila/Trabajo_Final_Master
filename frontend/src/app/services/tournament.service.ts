import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TournamentService {
private apiUrl = 'http://localhost:5000/api/events';


  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = window.localStorage.getItem('token') || '';
    }
    if (!token) {
      throw new Error('No se encontró un token en el localStorage.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Guardar resultados finales del torneo
  saveTournamentResults(eventId: number, results: any[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${eventId}/results`, { results }, { headers }).pipe(
      catchError((error) => {
        console.error('Error al guardar resultados del torneo:', error);
        return throwError(() => new Error('Error al guardar resultados del torneo.'));
      })
    );
  }
  

  // Obtener resultados finales del torneo
  getTournamentResults(eventId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/results`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener resultados del torneo:', error);
        return throwError(() => new Error('Error al obtener resultados del torneo.'));
      })
    );
  }

  // Obtener matches de un evento
getEventMatches(eventId: number): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(`${this.apiUrl}/${eventId}/matches`, { headers }).pipe(
    catchError((error) => {
      console.error('Error al obtener matches del evento:', error);
      return throwError(() => new Error('Error al obtener los matches del evento.'));
    })
  );
}


// Crear matches para un evento
createEventMatches(eventId: number, matches: any[]): Observable<void> {
  const headers = this.getAuthHeaders();
  return this.http.post<void>(`${this.apiUrl}/${eventId}/matches`, matches, { headers }).pipe(
    catchError((error) => {
      console.error('Error al crear los matches:', error);
      return throwError(() => new Error('Error al crear los matches del evento.'));
    })
  );
}


// Guardar una ronda eliminatoria
saveEliminationRound(eventId: number, round_number: number, pairings: any[]): Observable<void> {
  const headers = this.getAuthHeaders();
  return this.http.post<void>(
    `${this.apiUrl}/${eventId}/elimination-round`,
    { round_number, pairings },
    { headers }
  ).pipe(
    catchError((error) => {
      console.error('Error al guardar la ronda eliminatoria:', error);
      return throwError(() => new Error('Error al guardar la ronda eliminatoria.'));
    })
  );
}


// Obtener todas las rondas eliminatorias de un evento
getEliminationRounds(eventId: number): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(
    `${this.apiUrl}/${eventId}/elimination-rounds`,
    { headers }
  ).pipe(
    catchError((error) => {
      console.error('Error al obtener rondas eliminatorias:', error);
      return throwError(() => new Error('Error al obtener rondas eliminatorias.'));
    })
  );
}



}