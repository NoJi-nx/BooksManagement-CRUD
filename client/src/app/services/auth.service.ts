import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userNameKey = 'userName';
   private readonly TOKEN_KEY = 'auth_token';

  private loggedInSubject = new BehaviorSubject<boolean>(this.isTokenPresent());

  loggedIn$ = this.loggedInSubject.asObservable();




  constructor() {}

  private  isTokenPresent(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Get token
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }


  removeToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; 
  }

  register(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    console.log('Users in localStorage:', localStorage.getItem('mockUsers'));


    const userExists = users.some((user: any) => user.username === username);
    if (userExists) {
      return false;
    }


    users.push({ username, password });
    localStorage.setItem('mockUsers', JSON.stringify(users));
    return true;
  }


  login(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);

    console.log('Login successful:', !!user);
    if (user) {
      const payload = { username, exp: Math.floor(Date.now() / 1000) + 3600 }; // Mock expiry (1 hour)
      const token = `header.${btoa(JSON.stringify(payload))}.signature`; // Mock JWT
      localStorage.setItem('auth_token', token); // Save token to storage
      return true;
    } else {
      return false;
    }

  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);

  }

  getUserName(): string | null {
    const token = this.getToken(); // Assuming getToken() fetches the stored token
  if (!token) {
    return null;
  }

  // Decode the token (if it's a JWT)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
}
