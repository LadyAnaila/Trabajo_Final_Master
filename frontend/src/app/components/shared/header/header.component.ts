import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
})
export class HeaderComponent implements OnInit { 
  isLoggedIn: boolean = false; 
  role: string | null = null; 

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn(); 
    this.role = this.userService.getRole(); 
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false; 
    this.role = null; 
    this.router.navigate(['/login']);
    alert('Has cerrado sesión con éxito');            
  }
}