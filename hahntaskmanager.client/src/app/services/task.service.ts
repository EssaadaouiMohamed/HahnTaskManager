import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { 
  WorkItemDto, 
  WorkItemDetailDto, 
  CreateUpdateWorkItemDto,
  WorkItemStatus, 
  WorkItemPriority,
  getWorkItemStatusDisplayText,
  getWorkItemPriorityDisplayText
} from '../models/work-item';
import { UserDto } from '../models/user';
import { ViewType } from '../models/work-item';
import { GetWorkItemsQuery } from '../models/query'; // import your new model
import { PaginatedResult } from '../models/paginated-result'; // import PaginatedResult model

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {
  private baseUrl = 'http://localhost:5000';
  private apiUrl = `${this.baseUrl}/api/WorkItems`;

  private workItemsSubject = new BehaviorSubject<WorkItemDto[]>([]);
  private currentViewSubject = new BehaviorSubject<ViewType>(ViewType.GRID);
  private filterSubject = new BehaviorSubject<string>('All Work Items');
  private sortSubject = new BehaviorSubject<string>('Priority');

  public workItems$ = this.workItemsSubject.asObservable();
  public currentView$ = this.currentViewSubject.asObservable();
  public filter$ = this.filterSubject.asObservable();
  public sort$ = this.sortSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadWorkItems();
  }

  private loadWorkItems(): void {
    // Use the new search endpoint for initial load
    const defaultQuery: GetWorkItemsQuery = {
      pageNumber: 1,
      pageSize: 10
    };
    
    this.http.post<PaginatedResult<WorkItemDto>>(`${this.apiUrl}/search`, defaultQuery)
      .subscribe({
        next: (result) => {
          this.workItemsSubject.next(result.items);
        },
        error: () => {
          this.workItemsSubject.next([]);
        }
      });
  }

  getWorkItems(query?: GetWorkItemsQuery): Observable<PaginatedResult<WorkItemDto>> {
    // Use POST to /search endpoint with query in body
    const searchUrl = `${this.apiUrl}/search`;
    
    // If no query provided, create a default one
    const searchQuery = query || {
      pageNumber: 1,
      pageSize: 10
    };

    return this.http.post<PaginatedResult<WorkItemDto>>(searchUrl, searchQuery)
      .pipe(
        catchError(error => {
          console.error('Error fetching work items', error);
          return throwError(() => new Error('Failed to fetch work items'));
        })
      );
  }

  getWorkItemById(id: string): Observable<WorkItemDetailDto> {
    return this.http.get<WorkItemDetailDto>(`${this.apiUrl}/${id}`);
  }

  updateWorkItem(id: string, dto: CreateUpdateWorkItemDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteWorkItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting work item', error);
        return throwError(() => new Error('Failed to delete work item'));
      })
    );
  }

  changeWorkItemStatus(id: string, newStatus: WorkItemStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, newStatus).pipe(
      catchError(error => {
        console.error('Error changing work item status', error);
        return throwError(() => new Error('Failed to change work item status'));
      })
    );
  }

  setView(view: ViewType): void {
    this.currentViewSubject.next(view);
  }

  getCurrentView(): ViewType {
    return this.currentViewSubject.value;
  }

  setFilter(filter: string): void {
    this.filterSubject.next(filter);
  }

  setSort(sort: string): void {
    this.sortSubject.next(sort);
  }

  // Removed updateWorkItemStatus method - now using changeWorkItemStatus with API call

  getWorkItemsByStatus(status: WorkItemStatus): WorkItemDto[] {
    return this.workItemsSubject.value.filter(item => item.status === status);
  }

  createWorkItem(dto: CreateUpdateWorkItemDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto).pipe(
      catchError(error => {
        console.error('Error creating work item', error);
        return throwError(() => new Error('Failed to create work item'));
      })
    );
  }

  // Helper methods for display text
  getStatusDisplayText(status: WorkItemStatus): string {
    return getWorkItemStatusDisplayText(status);
  }

  getPriorityDisplayText(priority: WorkItemPriority): string {
    return getWorkItemPriorityDisplayText(priority);
  }
}
