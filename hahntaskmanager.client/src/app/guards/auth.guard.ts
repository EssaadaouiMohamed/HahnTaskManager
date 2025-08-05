import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard: Checking authentication...');
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard: isLoggedIn =', isLoggedIn);
    
    if (isLoggedIn) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    } else {
      console.log('AuthGuard: User is not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
} 