import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './components/register/register/register.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'cards',
    loadChildren: () => import('./components/cards/cards.module').then(m => m.CardsModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./components/user-profile/user-profile.module').then(m => m.UserProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./components/events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
  },
  { path: '**', redirectTo: 'login' }
];


export const appRoutingProviders: any[] = [];
export const routing = provideRouter(routes);

