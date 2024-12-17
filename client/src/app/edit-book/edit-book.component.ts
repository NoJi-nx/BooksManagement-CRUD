import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';
import { Book } from '../book.model';

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
    private bookService: BookService
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
    this.bookService.updateBook(this.book);
    console.log('Book updated:', this.book);
    this.router.navigate(['/books']);
  }
}

