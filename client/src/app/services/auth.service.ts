import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/api'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, {
      username,
      password,
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
