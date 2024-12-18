import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';


bootstrapApplication(AppComponent,{
  providers: [
    provideAnimations(),
    provideRouter([
      { path: 'books', loadComponent: () => import('./app/books-list/books-list.component').then(m => m.BooksListComponent) },
      { path: 'add-book', loadComponent: () => import('./app/add-book/add-book.component').then(m => m.AddBookComponent) },
      { path: 'edit-book/:id', loadComponent: () => import('./app/edit-book/edit-book.component').then(m => m.EditBookComponent) },
      { path: 'quotes', loadComponent: () => import('./app/my-quotes/my-quotes.component').then(m => m.MyQuotesComponent) },
      { path: '', redirectTo: '/books', pathMatch: 'full' },
      { path: '**', redirectTo: '/books' }
  ]),
  importProvidersFrom(ToastrModule.forRoot({ // Provide ToastrModule globally
    timeOut: 3000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    closeButton: true,
    progressBar: true
  }))
]
})
  .catch((err) => console.error(err));
