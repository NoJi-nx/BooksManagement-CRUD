import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent,{
  providers: [
    provideAnimations(),
    provideRouter(routes),

  importProvidersFrom(ToastrModule.forRoot({
    timeOut: 3000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    closeButton: true,
    progressBar: true
  }))
]
})
  .catch((err) => console.error(err));
