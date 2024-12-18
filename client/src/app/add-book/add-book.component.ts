import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { BookService } from '../book.service';
import { Book } from '../book.model';


@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ToastrModule],
  templateUrl: './add-book.component.html',
  styleUrls: []
})
export class AddBookComponent {
  constructor(
    private router: Router,
    private bookService: BookService,
  private toastr: ToastrService
) {}

  onSubmit(form: any): void {
    const newBook: Book = {
      id: Date.now(),
      ...form.value
    };
    this.bookService.addBook(newBook);
    this.toastr.success('Book added successfully!', 'Success');
    console.log('Book added:', newBook);

    this.router.navigate(['/books']);
  }
}
