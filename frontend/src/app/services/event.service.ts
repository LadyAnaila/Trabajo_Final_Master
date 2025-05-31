import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../models/event.model';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EventService {
private apiUrl = 'http://localhost:5000/api/events';


  constructor(private http: HttpClient) {}

  // Acceso seguro a localStorage
  private getLocalStorage(): Storage | null {
    return (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : null;
  }

  // Obtener headers con token
  private getAuthHeaders(): HttpHeaders {
    const ls = this.getLocalStorage();
    const token = ls ? ls.getItem('token') : '';
    if (!token) {
      throw new Error('No se encontró un token en localStorage.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Crear un nuevo evento
  createEvent(event: Event): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}`, event, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear el evento:', error);
        return throwError(() => new Error('Error al crear el evento.'));
      })
    );
  }

  // Obtener todos los eventos
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error al obtener eventos:', error);
        return throwError(() => new Error('Error al obtener eventos.'));
      })
    );
  }

  // Obtener evento por ID
getEventById(id: number): Observable<Event> {
  return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Error al obtener evento:', error);
      return throwError(() => new Error('Error al obtener evento.'));
    })
  );
}


  // Actualizar evento
  updateEvent(event: Event): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${event.id}`, event, { headers }).pipe(
      catchError(error => {
        console.error('Error al actualizar evento:', error);
        return throwError(() => new Error('Error al actualizar evento.'));
      })
    );
  }

  // Eliminar evento
  deleteEvent(eventId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error al eliminar evento:', error);
        return throwError(() => new Error('Error al eliminar evento.'));
      })
    );
  }

  // Inscribirse a un evento
  registerToEvent(eventId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>(`${this.apiUrl}/${eventId}/register`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Error al inscribirse:', error);
        return throwError(() => new Error('Error al inscribirse.'));
      })
    );
  }

  // Cancelar inscripción a un evento
  cancelRegistration(eventId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/unregister`, { headers }).pipe(
      catchError(error => {
        console.error('Error al cancelar inscripción:', error);
        return throwError(() => new Error('Error al cancelar inscripción.'));
      })
    );
  }

  // Obtener participantes del evento
  getEventParticipants(eventId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/participants`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener participantes:', error);
        return throwError(() => new Error('Error al obtener participantes.'));
      })
    );
  }

  // Obtener eventos creados por el usuario
  getCreatedEvents(): Observable<Event[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event[]>(`${this.apiUrl}/created`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener eventos creados:', error);
        return throwError(() => new Error('Error al obtener eventos creados.'));
      })
    );
  }

  // Obtener eventos donde está inscrito el usuario
  getRegisteredEvents(): Observable<Event[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event[]>(`${this.apiUrl}/registered`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener eventos inscritos:', error);
        return throwError(() => new Error('Error al obtener eventos inscritos.'));
      })
    );
  }
}
