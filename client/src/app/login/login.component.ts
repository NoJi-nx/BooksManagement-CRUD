import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Save the token
        this.router.navigate(['/books']); // Redirect to books page
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Invalid credentials');
      },
    });
  }
}
