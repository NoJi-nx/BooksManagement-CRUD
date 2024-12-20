import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private mockUsers = [
    { username: 'testuser', password: 'testpassword', token: 'mock-jwt-token' },
    { username: 'admin', password: 'admin123', token: 'admin-jwt-token' },
  ];

  constructor() {}

  login(username: string, password: string): Observable<{ token: string }> {
    const user = this.mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return of({ token: user.token });
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  register(username: string, password: string): Observable<{ success: boolean }> {
    const userExists = this.mockUsers.some((u) => u.username === username);

    if (userExists) {
      return throwError(() => new Error('User already exists'));
    } else {
      this.mockUsers.push({
        username,
        password,
        token: `${username}-mock-token`,
      });
      return of({ success: true });
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
