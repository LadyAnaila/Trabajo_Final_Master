import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,   MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
  ],
})
export class ManageEventsComponent implements OnInit {
  createdEvents: Event[] = [];
  registeredEvents: Event[] = [];
  isLoadingCreated = true;
  isLoadingRegistered = true;
  username: string | null = null;
  role: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole(); 
    this.username = this.authService.getUsername(); 

    if (this.role === 'store') {
      this.loadCreatedEvents(); 
    } else if (this.role === 'player') {
      this.loadRegisteredEvents();
    }
  }

  // Cargar eventos creados por el usuario
  loadCreatedEvents(): void {
    this.isLoadingCreated = true;
    this.eventService.getCreatedEvents().subscribe({
      next: (events) => {
        this.createdEvents = events;
        this.isLoadingCreated = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos creados:', error);
        this.isLoadingCreated = false;
      },
    });
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

  // Navegar al formulario para crear un evento

  navigateToCreate() {
  this.router.navigate(['/events/manage-events/form']);
}

  // Navegar al formulario para editar un evento
navigateToEdit(eventId: number): void {
  this.router.navigate(['/events/manage-events/form', eventId]);
}



//Detalles del evento 
viewDetails(eventId: number): void {
  this.router.navigate(['/events', eventId]);
}

    // Eliminar un evento
    deleteEvent(eventId: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            alert('Evento eliminado con éxito.');
            this.loadCreatedEvents(); // Recargar la lista de eventos
          },
          error: (error) => {
            console.error('Error al eliminar el evento:', error);
            alert('No se pudo eliminar el evento. Inténtalo de nuevo.');
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