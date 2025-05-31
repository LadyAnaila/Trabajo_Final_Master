import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  imports: [CommonModule],
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading = true; 

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {

    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false; 
      },
      error: (error) => {
        console.error('Error al cargar los eventos:', error);
        this.isLoading = false; 
      },
    });
  }


  
    // Navegar al detalle del evento
  viewEvent(id: number): void {
    this.router.navigate(['/events', id]);
  }
}