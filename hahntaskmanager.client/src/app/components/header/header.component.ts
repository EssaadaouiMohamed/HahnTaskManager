import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm: string = '';
  currentUser: UserDto | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSearch(event: any): void {
    this.searchChanged.emit(event.target.value);
  }

  onLogout(): void {
    console.log('Header: Logout button clicked');
    this.authService.logout().subscribe({
      next: () => {
        console.log('Header: Logout successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Header: Logout error:', error);
        // Even if logout fails, clear local auth and redirect
        this.authService.logoutLocal();
        this.router.navigate(['/login']);
      }
    });
  }

  getInitials(user: UserDto | null): string {
    if (!user) return 'U';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  }

  getFullName(user: UserDto | null): string {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  }
}