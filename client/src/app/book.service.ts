import { Injectable } from '@angular/core';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationDate: '1925-04-10' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', publicationDate: '1960-07-11' },
    { id: 3, title: '1984', author: 'George Orwell', publicationDate: '1949-06-08' }
  ];
  
  getBooks() {
    return this.books;
  }

  addBook(book: any) {
    this.books.push(book);
  }

  constructor() { }
}
