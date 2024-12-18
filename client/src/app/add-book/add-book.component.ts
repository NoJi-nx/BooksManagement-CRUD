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
  book = {
    title: '',
    author: '',
    publicationDate: ''
  };
  maxDate: string = '';

  constructor(
    private router: Router,
    private bookService: BookService,
  private toastr: ToastrService
) {
  const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const newBook = { id: Date.now(), ...form.value };
      this.bookService.addBook(newBook);
      this.toastr.success('Book added successfully!', 'Success');
      this.router.navigate(['/books']);
    } else {
      this.toastr.error('Please fill in all required fields.', 'Error');
    }
    }
    }



