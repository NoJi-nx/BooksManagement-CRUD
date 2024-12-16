import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books-list.component.html',
  styleUrls: []
})
export class BooksListComponent {
  books =[
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationDate: '1925-04-10' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', publicationDate: '1960-07-11' },
    { id: 3, title: '1984', author: 'George Orwell', publicationDate: '1949-06-08' }
  ];

  editBook(id: number) {
    console.log('Edit book with ID:', id);
  }

  deleteBook(id: number) {
    console.log('Edit book with ID:', id);
  }
}
