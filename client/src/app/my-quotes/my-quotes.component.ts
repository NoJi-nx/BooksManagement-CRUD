import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Quote } from '../models/quote.model';
import { DarklightThemeService } from '../darklight-theme.service';
import { faPlus, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,],
  templateUrl: './my-quotes.component.html',
  styleUrls: []
})
export class MyQuotesComponent implements OnInit {
  faPlus = faPlus; // Add the icons to component properties
  faTrash = faTrash;
  faSearch = faSearch;
  
  constructor(
    public themeService: DarklightThemeService
  ) {}


  quotes: Quote[] = [
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
    { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'Success is not the key to happiness. Happiness is the key to success.', author: 'Albert Schweitzer' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' }
  ];
  filteredQuotes: Quote[] = [];
  newQuote: Quote = { text: '', author: '' };
  searchTerm: string = '';

  itemsPerPage: number = 5;
currentPage: number = 1;
totalPages: number = 1;

  ngOnInit(): void {
    const savedQuotes = localStorage.getItem('myQuotes');
    if (savedQuotes) {
      this.quotes = JSON.parse(savedQuotes);
      this.filteredQuotes = [...this.quotes];
      this.updatePagination();
    }
  }

  addQuote(): void {
    if (this.newQuote.text.trim()) {
      this.quotes.push({ ...this.newQuote });
      this.saveQuotes();
      this.newQuote = { text: '', author: '' };
      this.filterQuotes();
    }
  }

  removeQuote(quote: Quote): void {
    this.quotes = this.quotes.filter((q) => q !== quote);
    this.saveQuotes();
    this.filterQuotes();
  }

  filterQuotes(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredQuotes = this.quotes.filter(
      (quote) =>
        quote.text.toLowerCase().includes(searchTermLower) ||
        (quote.author && quote.author.toLowerCase().includes(searchTermLower))
    );
  }


  saveQuotes(): void {
    localStorage.setItem('myQuotes', JSON.stringify(this.quotes));
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredQuotes.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredQuotes = this.quotes.slice(startIndex, endIndex);
}

nextPage(): void {
    if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePagination();
    }
}

previousPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
    }
}
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
