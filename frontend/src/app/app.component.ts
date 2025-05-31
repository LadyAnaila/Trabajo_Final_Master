import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './components/shared/shared.module';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SharedModule,],
  templateUrl: './app.component.html', 
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'the_arkham_horror_manager';
}
