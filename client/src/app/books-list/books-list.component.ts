import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book.model';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books-list.component.html',
  styleUrls: []
})
export class BooksListComponent implements OnInit {
  books: Book[] = []; // Explicitly define the type as Book[]

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.books = this.bookService.getBooks();
  }

  onAddBookClick() {
    console.log('Navigating to Add Book page...');
  }

  editBook(id: number) {
    console.log('Edit book with ID:', id);
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id);
      this.books = this.bookService.getBooks();
    }
    console.log('Delete book with ID:', id);
  }
}