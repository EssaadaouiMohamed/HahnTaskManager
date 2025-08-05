import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { WorkItemPriority, WorkItemStatus } from '../../models/work-item';
import { FilterOperator, SortDirection, GetWorkItemsQuery, FilterCondition, SortCondition } from '../../models/query';
import { UserDto } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<GetWorkItemsQuery>();
  @Output() sortChanged = new EventEmitter<GetWorkItemsQuery>();

  filterForm: FormGroup;
  showAdvancedFilters = false;
  users: UserDto[] = [];

  // Expose enums to template
  FilterOperator = FilterOperator;
  SortDirection = SortDirection;
  WorkItemPriority = WorkItemPriority;
  WorkItemStatus = WorkItemStatus;

  // Filter options
  filterOperators = [
    { value: FilterOperator.Equals, label: 'Equals' },
    { value: FilterOperator.NotEquals, label: 'Not Equals' },
    { value: FilterOperator.Contains, label: 'Contains' },
    { value: FilterOperator.StartsWith, label: 'Starts With' },
    { value: FilterOperator.EndsWith, label: 'Ends With' },
    { value: FilterOperator.GreaterThan, label: 'Greater Than' },
    { value: FilterOperator.GreaterThanOrEqual, label: 'Greater Than or Equal' },
    { value: FilterOperator.LessThan, label: 'Less Than' },
    { value: FilterOperator.LessThanOrEqual, label: 'Less Than or Equal' }
  ];

  sortDirections = [
    { value: SortDirection.Ascending, label: 'Ascending' },
    { value: SortDirection.Descending, label: 'Descending' }
  ];

  priorityOptions = [
    { value: WorkItemPriority.LOW, label: 'Low' },
    { value: WorkItemPriority.MEDIUM, label: 'Medium' },
    { value: WorkItemPriority.HIGH, label: 'High' },
    { value: WorkItemPriority.URGENT, label: 'Urgent' }
  ];

  statusOptions = [
    { value: WorkItemStatus.TODO, label: 'To Do' },
    { value: WorkItemStatus.IN_PROGRESS, label: 'In Progress' },
    { value: WorkItemStatus.DONE, label: 'Done' },
    { value: WorkItemStatus.BLOCKED, label: 'Blocked' }
  ];

  propertyOptions = [
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'assigneeId', label: 'Assigned To' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'description', label: 'Description' }
  ];

  // Quick filter presets
  quickFilters = [
    { label: 'All Work Items', query: {} as GetWorkItemsQuery },
    { label: 'High Priority', query: this.createQuery([{ propertyName: 'priority', operator: FilterOperator.GreaterThanOrEqual, value: WorkItemPriority.HIGH.toString() }]) },
    { label: 'Overdue', query: this.createQuery([{ propertyName: 'dueDate', operator: FilterOperator.LessThan, value: new Date().toISOString() }]) },
    { label: 'In Progress', query: this.createQuery([{ propertyName: 'status', operator: FilterOperator.Equals, value: WorkItemStatus.IN_PROGRESS.toString() }]) },
    { label: 'Blocked', query: this.createQuery([{ propertyName: 'status', operator: FilterOperator.Equals, value: WorkItemStatus.BLOCKED.toString() }]) }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: [''],
      priority: [''],
      assigneeId: [''],
      dueDateFrom: [''],
      dueDateTo: [''],
      sortBy: ['priority'],
      sortDirection: [SortDirection.Descending]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.setupFormListeners();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = [];
      }
    });
  }

  private setupFormListeners(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  onQuickFilterSelect(filter: any): void {
    // Reset the form to clear all current filters
    this.filterForm.reset();
    
    // If it's "All Work Items", send a clean query
    if (filter.label === 'All Work Items') {
      const cleanQuery: GetWorkItemsQuery = {
        pageNumber: 1,
        pageSize: 10
      };
      this.emitQuery(cleanQuery);
    } else {
      // For other quick filters, use the predefined query
      this.emitQuery(filter.query);
    }
  }

   onAdvancedFilterToggle(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
    console.log('Advanced filters toggled to:', this.showAdvancedFilters);
  }

  onClearFilters(): void {
    this.filterForm.reset();
    // Emit a clean query with no filters
    const cleanQuery: GetWorkItemsQuery = {
      pageNumber: 1,
      pageSize: 10
      // No filters or sorts - completely clean
    };
    this.emitQuery(cleanQuery);
  }

  private applyFilters(): void {
    const formValue = this.filterForm.value;
    const filters: FilterCondition[] = [];
    const sorts: SortCondition[] = [];

    console.log('FilterBar: applyFilters called with formValue:', formValue);

    // Search term filter (applies to title and description)
    if (formValue.searchTerm && formValue.searchTerm.trim() !== '') {
      console.log('FilterBar: Adding search filter for term:', formValue.searchTerm.trim());
      filters.push(
        { propertyName: 'title', operator: FilterOperator.Contains, value: formValue.searchTerm.trim() },
        { propertyName: 'description', operator: FilterOperator.Contains, value: formValue.searchTerm.trim() }
      );
    }

    // Status filter - only add if not empty and not null
    if (formValue.status && formValue.status !== '' && formValue.status !== null) {
      filters.push({ propertyName: 'status', operator: FilterOperator.Equals, value: formValue.status });
    }

    // Priority filter - only add if not empty and not null
    if (formValue.priority && formValue.priority !== '' && formValue.priority !== null) {
      filters.push({ propertyName: 'priority', operator: FilterOperator.Equals, value: formValue.priority });
    }

    // Assignee filter - only add if not empty and not null
    if (formValue.assigneeId && formValue.assigneeId !== '' && formValue.assigneeId !== null) {
      filters.push({ propertyName: 'assigneeId', operator: FilterOperator.Equals, value: formValue.assigneeId });
    }

    // Due date range filter - only add if not empty and not null
    if (formValue.dueDateFrom && formValue.dueDateFrom !== '' && formValue.dueDateFrom !== null) {
      filters.push({ propertyName: 'dueDate', operator: FilterOperator.GreaterThanOrEqual, value: formValue.dueDateFrom });
    }
    if (formValue.dueDateTo && formValue.dueDateTo !== '' && formValue.dueDateTo !== null) {
      filters.push({ propertyName: 'dueDate', operator: FilterOperator.LessThanOrEqual, value: formValue.dueDateTo });
    }

    // Sort configuration - only add if not empty and not null
    if (formValue.sortBy && formValue.sortBy !== '' && formValue.sortBy !== null) {
      sorts.push({
        propertyName: formValue.sortBy,
        direction: formValue.sortDirection || SortDirection.Ascending
      });
    }

    const query: GetWorkItemsQuery = {
      pageNumber: 1,
      pageSize: 10,
      filters: filters.length > 0 ? filters : undefined,
      sorts: sorts.length > 0 ? sorts : undefined
    };

    this.emitQuery(query);
  }

  private emitQuery(query: GetWorkItemsQuery): void {
    console.log('FilterBar: Emitting query:', query);
    this.filterChanged.emit(query);
    this.sortChanged.emit(query);
  }

  private createQuery(filters: FilterCondition[]): GetWorkItemsQuery {
    return {
      pageNumber: 1,
      pageSize: 10,
      filters: filters,
      sorts: [{ propertyName: 'priority', direction: SortDirection.Descending }]
    };
  }

  getFilterOperatorLabel(operator: FilterOperator): string {
    return this.filterOperators.find(op => op.value === operator)?.label || '';
  }

  getSortDirectionLabel(direction: SortDirection): string {
    return this.sortDirections.find(dir => dir.value === direction)?.label || '';
  }

  getStatusLabel(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value.toString() === statusValue);
    return status?.label || '';
  }

  getPriorityLabel(priorityValue: string): string {
    const priority = this.priorityOptions.find(p => p.value.toString() === priorityValue);
    return priority?.label || '';
  }

  getAssigneeName(assigneeId: string): string {
    const user = this.users.find(u => u.id === assigneeId);
    return user ? `${user.firstName} ${user.lastName}` : '';
  }
}
