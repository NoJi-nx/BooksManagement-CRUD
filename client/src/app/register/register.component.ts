import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  username ='';
  password = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router)
  {}

  register(): void {
    const registered = this.authService.register(this.username, this.password);
    if (registered) {
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = 'Username already exists';
    }
}
}
