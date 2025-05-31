import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
private apiUrl = 'http://localhost:5000/api/events/auth';
  constructor(private http: HttpClient) {}

  // Verifica si el entorno es un navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('authToken');
  }
  
  login(token: string, username: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
    }
  }


  getUsername(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('username');
    }
    return null;
  }
  getRole(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('role'); 
    }
    return null;
  }
  getAuthenticatedUser(): Observable<{ username: string }> {
    const token = this.isBrowser() ? localStorage.getItem('authToken') : '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{ username: string }>(`${this.apiUrl}/me`, { headers });
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
  }
}