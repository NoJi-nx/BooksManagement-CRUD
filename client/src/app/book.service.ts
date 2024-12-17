import { Injectable } from '@angular/core';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];

  constructor() {
    // Load books from localStorage when the service initializes
    const savedBooks = localStorage.getItem('books');
    this.books = savedBooks ? JSON.parse(savedBooks) : [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationDate: '1925-04-10' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', publicationDate: '1960-07-11' },
      { id: 3, title: '1984', author: 'George Orwell', publicationDate: '1949-06-08' }
    ];
  }
  
  getBooks(): Book[] {
    return this.books;
  }

  addBook(book: Book): void {
    this.books.push(book);
    this.saveBooksToLocalStorage();
  }
  private saveBooksToLocalStorage(): void {
    localStorage.setItem('books', JSON.stringify(this.books))
  }
}
