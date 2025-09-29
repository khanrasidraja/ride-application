import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const token = sessionStorage.getItem('token');
    const userRole = this.getUserRole(); // You'll need to implement this based on your JWT structure
    
    if (token && userRole === 'admin') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private getUserRole(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Decode JWT token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  }
}