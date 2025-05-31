import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  username: string | null = null;
  role: string | null = null;
  participants: any[] = [];
  showParticipants = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private eventService: EventService, 
    private location: Location
  ) {}

  private getLocalStorage(): Storage | null {
    return (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : null;
  }

  ngOnInit(): void {
    const ls = this.getLocalStorage();
    this.username = ls ? ls.getItem('username') : null;
    this.role = ls ? ls.getItem('role') : null;

    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.eventService.getEventById(+eventId).subscribe({
        next: (event) => {
          this.event = event;
          this.event.participants = this.event.participants || []; 
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar el evento:', error);
          this.isLoading = false;
        },
      });
    }
  }

  isUserRegistered(): boolean {
    if (!this.username || !this.event) {
      return false;
    }
    return this.event.participants?.includes(this.username) || false;
  }

  registerToEvent(): void {
    if (!this.username) {
      alert('Tienes que estar logueado para poder inscribirte.');
      return;
    }
    if (!this.event || this.event.id === undefined) {
      console.error('El evento no está definido o no tiene un ID válido.');
      return;
    }
    this.eventService.registerToEvent(this.event.id).subscribe({
      next: () => {
        alert('Te has inscrito al evento con éxito.');
        if (this.event) {
          this.event.participants = this.event.participants || [];
          if (!this.event.participants.includes(this.username!)) {
            this.event.participants.push(this.username!);
          }
        }
      },
      error: (error) => {
        alert('Error al inscribirse en el evento.');
      },
    });
  }

  viewOnMap(address?: string): void {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps?q=${encodedAddress}`, '_blank');
  }

navigateToEdit(eventId: number): void {
  this.router.navigate(['/events/manage-events/form', eventId]);
}



  // Cargar participantes (solo para organizador/creador)
  loadParticipants(): void {
    if (!this.event || !this.event.id) return;
    this.eventService.getEventParticipants(this.event.id).subscribe({
      next: (data) => {
        this.participants = data;
        this.showParticipants = true;
      },
      error: () => {
        alert('Error al cargar participantes');
      }
    }); 
  }

  // Mostrar el botón solo a organizador o creador
  get isStoreOrCreator(): boolean {
    return this.role === 'store' || (!!this.event && this.event.created_by === this.username);
  }

  // Volver a la página anterior
  goBack(): void {
    this.location.back();
  }     

isCompetitiveEvent(): boolean {
  const type = this.event?.event_type;
  return !!type && ['Torneo', 'Liga', 'Campeonato', 'Final de liga'].includes(type);
}

}