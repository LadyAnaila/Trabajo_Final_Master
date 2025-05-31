import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { PlayerEventsComponent } from './player-events/player-events.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { TournamentManagerComponent } from './tournament-manager/tournament-manager.component';

import { AuthGuard } from '../../guards/auth.guard'; 

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'manage-events', component: ManageEventsComponent, canActivate: [AuthGuard] },
  { path: 'manage-events/form', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'manage-events/form/:id', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'player-events', component: PlayerEventsComponent, canActivate: [AuthGuard] },
  { path: ':id/manage-tournament', component: TournamentManagerComponent, canActivate: [AuthGuard] },
  { path: ':id', component: EventDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}