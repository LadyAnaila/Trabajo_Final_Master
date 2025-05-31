import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { TournamentService } from '../../../services/tournament.service';
import { Event } from '../../../models/event.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface SwissPlayer {
  name: string;
  points: number;
  opponents: string[];
  hasBye?: boolean;
}

@Component({
  selector: 'app-tournament-manager',
  standalone: true,
  imports: [CommonModule,
     MatListModule, MatCardModule, MatChipsModule, 
    MatButtonModule, MatTableModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './tournament-manager.component.html',
  styleUrl: './tournament-manager.component.css'
})
export class TournamentManagerComponent implements OnInit {
  event!: Event;
  participants: string[] = [];
  pairings: [string, string][] = [];
  winners: string[] = [];
  currentRoundNumber = 1;

  swissPlayers: SwissPlayer[] = [];
  tournamentType: 'elimination' | 'swiss' = 'elimination';
  tournamentFinished = false;
  finalResults: any[] = [];

  // Para ranking eliminatorio
  private eliminationRanking: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private tournamentService: TournamentService
  ) { }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (!eventId) return;

    this.eventService.getEventById(eventId).subscribe(event => {
      this.event = event;
      this.fetchSavedResults();
    });

    this.eventService.getEventParticipants(eventId).subscribe(data => {
      this.participants = data.map((p: any) => p.name);
    });
  }

  ////////////////////////
  ///////ELIMINATORIO/////
  ////////////////////////

  generateEliminationPairings(): void {
    if (this.tournamentFinished || this.participants.length < 2) {
      window.alert('No hay suficientes participantes para emparejar.');
      return;
    }
    const shuffled = this.shuffleArray(this.participants);
    this.pairings = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      const player1 = shuffled[i];
      const player2 = shuffled[i + 1] || 'BYE';
      this.pairings.push([player1, player2]);
    }
    this.winners = Array(this.pairings.length).fill(null);
  }

  setWinner(index: number, winner: string) {
    if (!this.tournamentFinished) {
      this.winners[index] = winner;
    }
  }

  nextRound() {
    if (this.tournamentFinished) return;

    // Guardar eliminados de esta ronda (los que no ganaron)
    const eliminated = this.pairings
      .map(([p1, p2], i) => {
        if (!this.winners[i]) return null;
        return this.winners[i] === p1 ? p2 : p1;
      })
      .filter((name): name is string => !!name && name !== 'BYE');

    this.eliminationRanking = [...eliminated, ...this.eliminationRanking];

    // Avanzar ronda
    this.participants = this.winners.filter(Boolean);
    this.winners = [];
    this.currentRoundNumber++;

    if (this.participants.length === 1) {
      this.tournamentFinished = true;
      // El ganador primero y luego los eliminados por orden de eliminación
      this.finalResults = [this.participants[0], ...this.eliminationRanking];
      this.saveTournamentResults();
    } else {
      this.generateEliminationPairings();
    }
  }

  // Clasificación provisional eliminatorio
  get eliminationProvisionalRanking(): string[] {
    return [...this.participants, ...this.eliminationRanking];
  }

  ////////////////////////
  ////////// SUIZO ///////
  ////////////////////////
  generateSwissPairings(): void {
    if (this.tournamentFinished) return;

    if (this.swissPlayers.length === 0) {
      this.swissPlayers = this.participants.map(name => ({
        name,
        points: 0,
        opponents: [],
        hasBye: false
      }));
    }

    const sortedPlayers = [...this.swissPlayers].sort((a, b) => b.points - a.points || Math.random() - 0.5);
    const used = new Set<string>();
    const newPairings: [string, string][] = [];

    for (let i = 0; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      if (used.has(player.name)) continue;

      const opponent = sortedPlayers.find(
        (p, idx) =>
          idx > i &&
          !used.has(p.name) &&
          !player.opponents.includes(p.name)
      );

      if (opponent) {
        newPairings.push([player.name, opponent.name]);
        used.add(player.name);
        used.add(opponent.name);
      } else if (!player.hasBye) {
        newPairings.push([player.name, 'BYE']);
        used.add(player.name);
        player.hasBye = true;
      }
    }

    this.pairings = newPairings;
    this.winners = Array(this.pairings.length).fill(null);
  }

  finishSwissRound(): void {
    if (this.tournamentFinished) return;

    this.pairings.forEach(([p1, p2], idx) => {
      const winner = this.winners[idx];
      const player1 = this.swissPlayers.find(p => p.name === p1);
      const player2 = this.swissPlayers.find(p => p.name === p2);

      if (p2 === 'BYE' && player1) {
        player1.points += 1;
        return;
      }
      if (winner === p1 && player1) player1.points += 1;
      if (winner === p2 && player2) player2.points += 1;

      if (player1 && player2) {
        player1.opponents.push(p2);
        player2.opponents.push(p1);
      }
    });

    const maxRounds = Math.ceil(Math.log2(this.swissPlayers.length)) + 1;
    if (this.currentRoundNumber >= maxRounds) {
      this.tournamentFinished = true;
      this.finalResults = this.getSwissRanking();
      this.saveTournamentResults();
    } else {
      this.currentRoundNumber++;
      this.generateSwissPairings();
    }
  }

  ////////////////////////
  ///// RESULTADOS ///////
  ////////////////////////

  saveTournamentResults() {
    const eventId = this.event?.id;
    if (!eventId) return;
    this.tournamentService.saveTournamentResults(eventId, this.finalResults).subscribe({
      next: () => console.log('Resultados guardados en el backend'),
      error: (err) => console.error('Error al guardar resultados:', err)
    });
  }

  countWinners(): number {
    return this.winners.filter(Boolean).length;
  }

  getSwissRanking() {
    return [...this.swissPlayers].sort((a, b) => b.points - a.points);
  }

  get swissRanking() {
    return this.getSwissRanking();
  }

  shuffleArray(arr: string[]): string[] {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  fetchSavedResults() {
    const eventId = this.event?.id;
    if (!eventId) return;
    this.tournamentService.getTournamentResults(eventId).subscribe({
      next: (results) => {
        console.log('Saved results:', results);
        this.finalResults = results;
        this.tournamentFinished = true;
      },
      error: (err) => {
        console.error('Error fetching saved results:', err);
      }
    });
  }
}