import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { History } from '../../models/history.model';
import { Achievement } from '../../models/achievement.model';

import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule, 
    MatListModule, 
    MatTableModule
  ],
  providers: [UserService]
})
export class UserProfileComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  bio: string | null = null;
  role: string | null = null;
  isEditing: boolean = false;
  history: History[] = [];
  achievements: Achievement[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfileAndExtras();
  }

  private loadProfileAndExtras(): void {
    this.userService.getUserProfile().subscribe({
      next: (user: User) => {
        this.username = user.username;
        this.email = user.email;
        this.bio = user.bio || '';
        this.role = user.role;

        // Cargar historial y logros al iniciar
        if (this.username) {
          this.userService.getUserHistory(this.username).subscribe(data => this.history = data);
          this.userService.getUserAchievements(this.username).subscribe(data => this.achievements = data);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar el perfil del usuario:', error);
        alert('Hubo un problema al cargar los datos del perfil. Por favor, inténtalo más tarde.');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (!this.email || !this.email.includes('@')) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    const updatedData = {
      email: this.email,
      bio: this.bio || ''
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: () => {
        alert('Perfil actualizado con éxito');
        this.isEditing = false;
        // Recargar historial y logros tras guardar
        if (this.username) {
          this.userService.getUserHistory(this.username).subscribe(data => this.history = data);
          this.userService.getUserAchievements(this.username).subscribe(data => this.achievements = data);
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Hubo un error al actualizar el perfil. Por favor, inténtalo más tarde.');
      }
    });
  }
}