import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 

})
export class LoginComponent {
  loginForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
onSubmit(): void {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    this.userService.login({ username, password }).subscribe({
next: (response) => {
  console.log('Respuesta del backend:', response);
  localStorage.setItem('authToken', response.token); // <--- usa 'authToken'
  localStorage.setItem('username', response.username);
  localStorage.setItem('role', response.role);
  this.router.navigate(['/profile']);
},
error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales incorrectas.');
      },
    });
  }
}

}