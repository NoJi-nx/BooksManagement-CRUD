import { Routes } from '@angular/router';
import { BooksListComponent } from './books-list/books-list.component';
import { AddBookComponent } from './add-book/add-book.component';
import { MyQuotesComponent } from './my-quotes/my-quotes.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksListComponent , canActivate: [AuthGuard] },
  { path: 'add-book', component: AddBookComponent , canActivate: [AuthGuard] },
  { path: 'my-quotes', component: MyQuotesComponent , canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/books' },
];
