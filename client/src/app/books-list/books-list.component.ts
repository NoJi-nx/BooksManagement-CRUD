import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book.model';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import { DarklightThemeService } from '../darklight-theme.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './books-list.component.html',
  styleUrls: []
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  isDarkMode: boolean = false;

  constructor(
    private bookService: BookService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    public themeService: DarklightThemeService
  ) {}

  ngOnInit(): void {
    this.books = this.bookService.getBooks();
    this.filteredBooks = [...this.books];

    const theme = localStorage.getItem('theme');
    this.isDarkMode = theme === 'dark';
    this.applyTheme();
  }
  private applyTheme(): void {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  filterBooks(): void {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(lowerCaseTerm) ||
      book.author.toLowerCase().includes(lowerCaseTerm)
      );
  }

  editBook(id: number) {
    console.log('Edit book with ID:', id);
  }

  editBookSuccess(): void {
    this.books = this.bookService.getBooks();
    this.filteredBooks = [...this.books];
    this.toastr.success('Book updated successfully!', 'Success');
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id);
      this.toastr.success('Book deleted successfully!', 'Success');
      this.books = this.bookService.getBooks();
    }
    console.log('Delete book with ID:', id);
  }

  sortColumn: string = '';
sortOrder: string = 'asc';

sortBooks(column: string): void{
  if (this.sortColumn === column) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortOrder = 'asc';
  }


  this.filteredBooks.sort((a: Book, b: Book) => {
    const valueA = a[column as keyof Book];
    const valueB = b[column as keyof Book];


    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return this.sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }


    return this.sortOrder === 'asc' ? +valueA - +valueB : +valueB - +valueA;
  });
}
}
