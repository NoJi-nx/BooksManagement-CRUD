import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DarklightThemeService } from '../darklight-theme.service';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './my-quotes.component.html',
  styleUrls: []
})
export class MyQuotesComponent {

  constructor(
    public themeService: DarklightThemeService
  ) {}

  allQuotes = [
    '“The only limit to our realization of tomorrow is our doubts of today.” – Franklin D. Roosevelt',
    '“In the middle of every difficulty lies opportunity.” – Albert Einstein',
    '“Success is not the key to happiness. Happiness is the key to success.” – Albert Schweitzer',
    '“The future belongs to those who believe in the beauty of their dreams.” – Eleanor Roosevelt',
    '“Do what you can, with what you have, where you are.” – Theodore Roosevelt',
    '“Life is 10% what happens to us and 90% how we react to it.” – Charles R. Swindoll',
    '“Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.” – Helen Keller',
    '“It does not matter how slowly you go as long as you do not stop.” – Confucius',
    '“If you want to lift yourself up, lift up someone else.” – Booker T. Washington',
    '“The best way to predict the future is to create it.” – Peter Drucker',
    '“You miss 100% of the shots you don’t take.” – Wayne Gretzky',
    '“I have not failed. I’ve just found 10,000 ways that won’t work.” – Thomas Edison',
    '“The secret of getting ahead is getting started.” – Mark Twain',
    '“Happiness is not something ready-made. It comes from your own actions.” – Dalai Lama',
    '“You only live once, but if you do it right, once is enough.” – Mae West'
  ];
  quotes: string[] = [];

  ngOnInit(): void {
    this.randomizeQuotes();
  }

  randomizeQuotes(): void {
    const shuffled = this.allQuotes.sort(() => 0.5 - Math.random());
    this.quotes = shuffled.slice(0, 5);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
