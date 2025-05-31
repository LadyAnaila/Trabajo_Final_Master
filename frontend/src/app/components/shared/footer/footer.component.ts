import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbar]
})
export class FooterComponent { }