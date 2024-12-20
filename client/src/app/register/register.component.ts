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
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router)
  {}

  register(): void {
    this.authService.register(this.username, this.password).subscribe(
      () => {
        alert('Registration successful! You can now log in');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }
}
