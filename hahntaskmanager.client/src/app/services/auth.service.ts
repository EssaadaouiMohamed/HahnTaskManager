import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginDto, AuthResponse } from '../models/auth';
import { UserDto } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5000/api';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'current_user';
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    console.log('AuthService: Initializing authentication...');
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    console.log('AuthService: Token found =', !!token);
    console.log('AuthService: User found =', !!user);
    
    if (token && user) {
      console.log('AuthService: Setting user as authenticated');
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    } else {
      console.log('AuthService: No valid token or user found');
    }
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    console.log('Attempting login with:', loginDto);
    const url = `${this.baseUrl}/auth/login`; // Double-check this URL!
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(url, loginDto, { headers }).pipe(
      tap({
        next: (response) => {
          this.setToken(response.token);
          this.decodeAndSetUser(response.token);
          this.isAuthenticatedSubject.next(true);
        },
        error: (err) => {
          console.error('Login failed:', err);
          if (err instanceof HttpErrorResponse) {
            console.error('Status:', err.status);
            console.error('Error message:', err.message);
            if (err.error) {
              console.error('Server response:', err.error);
            }
          }
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }

  logoutLocal(): void {
    this.clearAuth();
  }
  
  private decodeAndSetUser(token: string): void {
    try {
      const payload = this.jwtHelper.decodeToken(token);
      const user: UserDto = {
        id: payload.sub || payload.userId,
        email: payload.email,
        firstName: payload.given_name || payload.firstName,
        lastName: payload.family_name || payload.lastName,
        position: payload.position || payload.role || 'User'
      };
      this.setCurrentUser(user);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setCurrentUser(user: UserDto): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private getCurrentUser(): UserDto | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getAuthToken(): string | null {
    return this.getToken();
  }

  isLoggedIn(): boolean {
    const isLoggedIn = this.isAuthenticatedSubject.value;
    console.log('AuthService: isLoggedIn() called, returning =', isLoggedIn);
    return isLoggedIn;
  }

  getCurrentUserValue(): UserDto | null {
    return this.currentUserSubject.value;
  }
} 
