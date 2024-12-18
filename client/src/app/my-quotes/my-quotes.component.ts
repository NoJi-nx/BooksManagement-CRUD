import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './my-quotes.component.html',
  styleUrls: []
})
export class MyQuotesComponent {
  quotes: string[] = [
   '“The only limit to our realization of tomorrow is our doubts of today.” – Franklin D. Roosevelt',
    '“In the middle of every difficulty lies opportunity.” – Albert Einstein',
    '“Success is not the key to happiness. Happiness is the key to success.” – Albert Schweitzer',
    '“The future belongs to those who believe in the beauty of their dreams.” – Eleanor Roosevelt',
    '“Do what you can, with what you have, where you are.” – Theodore Roosevelt'
  ];
}
