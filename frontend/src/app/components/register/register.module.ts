import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register/register.component';


import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; 

@NgModule({
  declarations: [], 
  imports: [
    RegisterComponent, 
    CommonModule,
    ReactiveFormsModule,
    RegisterRoutingModule, 

    CommonModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule, 
    MatSelectModule,
    MatOptionModule,

  ],
  providers: [
  ]
})
export class RegisterModule { }
