import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserDto } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:5001';
  private apiUrl = `${this.baseUrl}/api/Users`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching users', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }
} 