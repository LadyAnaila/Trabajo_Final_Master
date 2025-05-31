import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { History } from '../models/history.model';
import { Achievement } from '../models/achievement.model';
import { Ranking } from '../models/ranking.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Acceso seguro a localStorage
  private getLocalStorage(): Storage | null {
    return (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : null;
  }

  // Registro de usuario
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  // Inicio de sesión
  login(credentials: { username: string; password: string }): Observable<{ token: string; username: string; role: string }> {
    return this.http.post<{ token: string; username: string; role: string }>(`${this.apiUrl}/users/login`, credentials).pipe(
      map((response) => {
        const ls = this.getLocalStorage();
        if (ls) {
          ls.setItem('token', response.token);
          ls.setItem('username', response.username);
          ls.setItem('role', response.role);
        }
        return response;
      }),
      catchError((error: any) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('Error al iniciar sesión.'));
      })
    );
  }

  // Obtener el perfil del usuario
  getUserProfile(): Observable<User> {
    const ls = this.getLocalStorage();
    const token = ls ? ls.getItem('token') : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers });
  }

  // Actualizar el perfil del usuario
  updateProfile(data: any): Observable<any> {
    const ls = this.getLocalStorage();
    const token = ls ? ls.getItem('token') : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/users/profile`, data, { headers });
  }

  // Obtener el rol del usuario
  getRole(): string | null {
    const ls = this.getLocalStorage();
    return ls ? ls.getItem('role') : null;
  }

  // Obtener el nombre de usuario
  getUsername(): string | null {
    const ls = this.getLocalStorage();
    return ls ? ls.getItem('username') : null;
  }

  // Cerrar sesión
  logout(): void {
    const ls = this.getLocalStorage();
    if (ls) {
      ls.removeItem('token');
      ls.removeItem('username');
      ls.removeItem('role');
    }
  }

  // Comprobar si el usuario está autenticado
  isLoggedIn(): boolean {
    const ls = this.getLocalStorage();
    const token = ls ? ls.getItem('token') : null;
    return !!token;
  }

  // Historial de usuario
  getUserHistory(username: string): Observable<History[]> {
    const ls = this.getLocalStorage();
    const token = ls ? ls.getItem('token') : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<History[]>(`${this.apiUrl}/users/${username}/history`, { headers });
  }

  // Logros de usuario
  getUserAchievements(username: string): Observable<Achievement[]> {
    const ls = this.getLocalStorage();
    const token = ls ? ls.getItem('token') : '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Achievement[]>(`${this.apiUrl}/users/${username}/achievements`, { headers });
  }

  // Ranking de torneo
  getTournamentRanking(tournamentId: number): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(`${this.apiUrl}/tournaments/${tournamentId}/ranking`);
  }
}