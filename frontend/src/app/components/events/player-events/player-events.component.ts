import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-player-events',
  templateUrl: './player-events.component.html',
  styleUrls: ['./player-events.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class PlayerEventsComponent implements OnInit {
  registeredEvents: Event[] = [];
  isLoadingRegistered = true;

constructor(
  private eventService: EventService,
  private router: Router
) {
}

ngOnInit(): void {
    this.loadRegisteredEvents();
  }

  // Cargar eventos en los que el usuario está inscrito
  loadRegisteredEvents(): void {
    this.isLoadingRegistered = true;
    this.eventService.getRegisteredEvents().subscribe({
      next: (data: Event[]) => {
        this.registeredEvents = data;
        this.isLoadingRegistered = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos inscritos:', error);
        this.isLoadingRegistered = false;
      },
    });
  }
  
  //Detalles del evento 
viewDetails(eventId: number): void {
  this.router.navigate(['/events', eventId]);
}


    // Cancelar la inscripción a un evento
    cancelRegistration(eventId: number): void {
      if (confirm('¿Estás seguro de que deseas cancelar tu inscripción a este evento?')) {
        this.eventService.cancelRegistration(eventId).subscribe({
          next: () => {
            alert('Inscripción cancelada con éxito.');
            this.loadRegisteredEvents(); // Recargar la lista de eventos inscritos
          },
          error: (error) => {
            console.error('Error al cancelar la inscripción:', error);
            alert('No se pudo cancelar la inscripción. Inténtalo de nuevo.');
          },
        });
      }
    }
  

    // Ver dirección en Google Maps
    viewOnMap(address: string): void {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps?q=${encodedAddress}`, '_blank');
    }
  


}