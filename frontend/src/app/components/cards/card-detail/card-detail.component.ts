import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../../../services/card.service';
import { CommonModule } from '@angular/common';
import { Card } from '../../../models/card.model';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'], 
    standalone: true,  
    imports: [CommonModule]  
  
})
export class CardDetailComponent implements OnInit {
  card: Card | undefined;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.cardService.getCardByCode(code).subscribe(data => {
        this.card = data;
      });
    }
  }
}