import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent,{
  providers: [
    provideRouter([
      { path: 'books', loadComponent: () => import('./app/books-list/books-list.component').then(m => m.BooksListComponent) },
      { path: 'add-book', loadComponent: () => import('./app/add-book/add-book.component').then(m => m.AddBookComponent) }, // Move this before wildcard
      { path: 'quotes', loadComponent: () => import('./app/my-quotes/my-quotes.component').then(m => m.MyQuotesComponent) },
      { path: '', redirectTo: '/books', pathMatch: 'full' },
      { path: '**', redirectTo: '/books' }
  ])
  ]
})
  .catch((err) => console.error(err));
