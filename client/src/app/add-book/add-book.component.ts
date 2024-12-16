import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from '../book.model';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './add-book.component.html',
  styleUrls: []
})
export class AddBookComponent {
  constructor(private router: Router, private bookService: BookService) {}

  onSubmit(form: any) {
    const newBook: Book = {
      id: Date.now(), // Generate a unique ID
      ...form.value
    };
    this.bookService.addBook(newBook);
    console.log('Book added:', newBook);
    this.router.navigate(['/books']);
  }
}