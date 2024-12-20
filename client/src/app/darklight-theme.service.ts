import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarklightThemeService {
  private isDarkMode: boolean = false;

  private applyTheme(): void{
    document.body.classList.toggle('dark-theme', this.isDarkMode);
   }
   
  constructor() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
   }

   toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
   }

   getTheme(): boolean{
    return this.isDarkMode;
   }


}
