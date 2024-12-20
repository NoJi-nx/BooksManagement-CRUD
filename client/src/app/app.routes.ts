import { Routes } from '@angular/router';
import { BooksListComponent } from './books-list/books-list.component';
import { AddBookComponent } from './add-book/add-book.component';
import { MyQuotesComponent } from './my-quotes/my-quotes.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksListComponent },
  { path: 'add-book', component: AddBookComponent },
  { path: 'my-quotes', component: MyQuotesComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/books' },
];
