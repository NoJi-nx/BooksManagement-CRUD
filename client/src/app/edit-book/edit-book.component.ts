import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from '../book.model';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-book.component.html',
  styleUrls: []
})
export class EditBookComponent implements OnInit {
  book: Book = { id: 0, title: '', author: '', publicationDate: ''};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private toastr: ToastrService
  )   {}

  ngOnInit(): void {
      const bookId = Number(this.route.snapshot.paramMap.get('id'));
      const foundBook = this.bookService.getBookById(bookId);
      if (foundBook) {
        this.book = {...foundBook};
      } else {
        this.router.navigate(['/books']);
      }
  }

  onSubmit(form: any): void{
    const updatedBook = { id: this.book.id, ...form.value };
  this.bookService.updateBook(updatedBook);
  this.toastr.success('Book updated successfully!', 'Success'); 
  this.router.navigate(['/books']);
  }
}

