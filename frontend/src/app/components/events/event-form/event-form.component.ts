import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../services/auth.service';

import { EVENT_TYPES } from '../../../constants/event-types';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class EventFormComponent implements OnInit {
  newEvent: Event = {
    id: 0,
    name: '',
    description: '',
    date: '',
    address: '',
    game_name: 'Sin especificar',
    format: '',
    event_type: '',
    tournament_type: '', 
    start_time: '00:00:00',
    registration_fee: 0.0,
    max_participants: 0,
    visibility: true,
    image_url: '',
    duration: 0,
    contact_info: '',
    age_restriction: '',
    languages: '',
    cancellation_policy: '',
    internal_notes: '',
    created_by: '',
    created_at: '',
    participants: [],
  };
  eventTypes = EVENT_TYPES;

  isEditing = false;
  isLoading = false;
  isOtherGame = false;

games: string[] = [
  '7 Wonders',
  'Android: Netrunner',
  'Aventureros al Tren',
  'Ark Nova',
  'Arkham Horror: El juego de cartas',
  'Betrayal at House on the Hill',
  'Blood Rage',
  'Brass: Birmingham',
  'Carcassonne',
  'Catan',
  'Clank!',
  'Codenames',
  'Digimon Card Game',
  'Dixit',
  'Dragon Ball Super Card Game',
  'Dune: Imperium',
  'Everdell',
  'Exploding Kittens',
  'Flesh and Blood',
  'Force of Will',
  'Gloomhaven',
  'Juego de Tronos: El juego de cartas',
  'KeyForge',
  'La Leyenda de los Cinco Anillos: El juego de cartas',
  'Love Letter',
  'Magic: The Gathering',
  'Marvel Champions: El juego de cartas',
  'Mysterium',
  'One Piece Card Game',
  'Pandemic',
  'Pokémon TCG',
  'Root',
  'Scythe',
  'Secret Hitler',
  'Splendor',
  'Spirit Island',
  'Sushi Go!',
  'Terraforming Mars',
  'Twilight Imperium',
  'Unstable Unicorns',
  'Weiß Schwarz',
  'Wingspan',
  'Otros'
];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.isEditing = true;
      this.loadEvent(+eventId);
    }
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.newEvent = event;
        this.isLoading = false;
      },
      error: () => {
        window.alert('No se pudo cargar el evento. Serás redirigido a la lista de eventos.');
        this.isLoading = false;
        this.router.navigate(['/events/manage-events']);
      },
    });
  }

  onGameChange() {
    this.isOtherGame = this.newEvent.game_name === 'Otros';
  }

  viewOnMap(address?: string): void {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps?q=${encodedAddress}`, '_blank');
  }

  isCompetitiveEvent(): boolean {
  return ['Torneo', 'Liga', 'Campeonato', 'Final de liga'].includes(this.newEvent.event_type);
}


saveEvent(): void {
  // Verifica token antes de guardar
  const token = localStorage.getItem('token');
  if (!token) {
    window.alert('Debes iniciar sesión para guardar el evento.');
    return;
  }

  if (this.newEvent.date && this.newEvent.date.includes('T')) {
    this.newEvent.date = this.newEvent.date.split('T')[0];
  }

  (this.newEvent as any).created_at = undefined;
  (this.newEvent as any).participants = undefined;

  if (this.isEditing) {
    this.eventService.updateEvent(this.newEvent).subscribe({
      next: () => {
        window.alert('Evento actualizado con éxito');
        this.router.navigate(['/events/manage-events']);
      },
      error: (error) => {
        console.error('Error al actualizar el evento:', error);
        window.alert('Hubo un error al actualizar el evento. Por favor, inténtalo de nuevo.');
      },
    });
  } else {
    this.eventService.createEvent(this.newEvent).subscribe({
      next: () => {
        window.alert('Evento creado con éxito');
        this.router.navigate(['/events/manage-events']);
      },
      error: (error) => {
        console.error('Error al crear el evento:', error);
        window.alert('Hubo un error al crear el evento. Por favor, inténtalo de nuevo.');
      },
    });
  }
}


}