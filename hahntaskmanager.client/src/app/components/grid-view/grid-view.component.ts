import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkItemDto, WorkItemStatus, WorkItemPriority, getWorkItemStatusDisplayText, getWorkItemPriorityDisplayText } from '../../models/work-item';

@Component({
  selector: 'app-grid-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css']
})
export class GridViewComponent {
  @Input() workItems: WorkItemDto[] = [];
  @Output() workItemAction = new EventEmitter<WorkItemDto>();
  @Output() editWorkItem = new EventEmitter<WorkItemDto>();
  @Output() deleteWorkItem = new EventEmitter<WorkItemDto>();

  selectAll = false;
  selectedWorkItems = new Set<string>();
  currentPage = 1;
  pageSize = 10;
  totalWorkItems = 0;
  totalPages = 1;

  ngOnInit(): void {
    this.updatePagination();
  }

  ngOnChanges(): void {
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalWorkItems = this.workItems.length;
    this.totalPages = Math.ceil(this.totalWorkItems / this.pageSize);
  }

  trackByWorkItemId(index: number, workItem: WorkItemDto): string {
    return workItem.id;
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.workItems.forEach(workItem => this.selectedWorkItems.add(workItem.id));
    } else {
      this.selectedWorkItems.clear();
    }
  }

  toggleWorkItemSelection(workItemId: string): void {
    if (this.selectedWorkItems.has(workItemId)) {
      this.selectedWorkItems.delete(workItemId);
    } else {
      this.selectedWorkItems.add(workItemId);
    }
    this.selectAll = this.selectedWorkItems.size === this.workItems.length;
  }

  onWorkItemAction(workItem: WorkItemDto): void {
    this.workItemAction.emit(workItem);
  }

  onEditWorkItem(workItem: WorkItemDto): void {
    this.editWorkItem.emit(workItem);
  }

  onDeleteWorkItem(workItem: WorkItemDto): void {
    this.deleteWorkItem.emit(workItem);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Helper methods for display text
  getStatusDisplayText(status: WorkItemStatus): string {
    return getWorkItemStatusDisplayText(status);
  }

  getPriorityDisplayText(priority: WorkItemPriority): string {
    return getWorkItemPriorityDisplayText(priority);
  }

  getInitials(name?: string): string {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('');
  }

  // Expose Math to template
  Math = Math;
}