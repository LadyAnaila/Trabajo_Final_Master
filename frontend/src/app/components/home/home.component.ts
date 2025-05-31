import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



import { EVENT_TYPES } from '../../constants/event-types';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
    MatButtonModule,

  ],
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  eventTypes = EVENT_TYPES;
  filters = {
    game_name: '',
    event_type: '',
    date: '',
    organizer: '',
  };

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
      },
    });
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesGameName = this.filters.game_name
        ? event.game_name.toLowerCase().includes(this.filters.game_name.toLowerCase())
        : true;

      const matchesEventType = this.filters.event_type
        ? event.event_type.toLowerCase().includes(this.filters.event_type.toLowerCase())
        : true;

      const matchesOrganizer = this.filters.organizer
        ? event.created_by && event.created_by.toLowerCase().includes(this.filters.organizer.toLowerCase())
        : true;


      return matchesGameName && matchesEventType;
    });
  }
}