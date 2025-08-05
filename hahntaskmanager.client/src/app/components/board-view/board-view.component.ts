import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WorkItemDto, WorkItemStatus, getWorkItemStatusDisplayText } from '../../models/work-item';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit, OnChanges {
  @Input() workItems: WorkItemDto[] = [];
  @Output() workItemStatusChanged = new EventEmitter<{workItemId: string, newStatus: WorkItemStatus}>();

  // Separate arrays for each status to work with CDK drag and drop
  todoItems: WorkItemDto[] = [];
  inProgressItems: WorkItemDto[] = [];
  doneItems: WorkItemDto[] = [];
  blockedItems: WorkItemDto[] = [];

  trackByWorkItemId(index: number, workItem: WorkItemDto): string {
    return workItem.id;
  }

  ngOnInit(): void {
    console.log('BoardView: Component initialized');
    this.updateStatusArrays();
    console.log('BoardView: Initial arrays - Todo:', this.todoItems.length, 'InProgress:', this.inProgressItems.length, 'Done:', this.doneItems.length, 'Blocked:', this.blockedItems.length);
  }

  // Update the separate arrays when workItems input changes
  ngOnChanges(): void {
    console.log('BoardView: workItems input changed, updating arrays');
    this.updateStatusArrays();
    console.log('BoardView: Arrays updated - Todo:', this.todoItems.length, 'InProgress:', this.inProgressItems.length, 'Done:', this.doneItems.length, 'Blocked:', this.blockedItems.length);
  }

  private updateStatusArrays(): void {
    this.todoItems = this.workItems.filter(item => item.status === 0);
    this.inProgressItems = this.workItems.filter(item => item.status === 1);
    this.doneItems = this.workItems.filter(item => item.status === 2);
    this.blockedItems = this.workItems.filter(item => item.status === 3);
    console.log('BoardView: Status arrays updated');
  }

  getWorkItemsByStatus(status: WorkItemStatus): WorkItemDto[] {
    switch (status) {
      case 0: return this.todoItems;
      case 1: return this.inProgressItems;
      case 2: return this.doneItems;
      case 3: return this.blockedItems;
      default: return [];
    }
  }

  drop(event: CdkDragDrop<WorkItemDto[]>, newStatus: WorkItemStatus): void {
    console.log('Drop event triggered:', event);
    console.log('Event item data:', event.item.data);
    console.log('Previous container:', event.previousContainer);
    console.log('Current container:', event.container);
    console.log('New status:', newStatus);
    
    // Ensure we have valid data
    if (!event.item.data) {
      console.warn('No work item data found in drag event');
      return;
    }

    const workItem = event.item.data as WorkItemDto;
    
    // Validate the work item has required properties
    if (!workItem.id) {
      console.error('Work item missing ID');
      return;
    }

    console.log(`Dropping work item ${workItem.id} to status ${newStatus}`);
    
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      console.log('Reordering within same column');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between columns - only emit if status actually changed
      const oldStatus = workItem.status;
      if (oldStatus !== newStatus) {
        console.log(`Status change: ${oldStatus} -> ${newStatus}`);
        
        // Update the work item status locally for immediate UI feedback
        workItem.status = newStatus;
        
        // Transfer the item between arrays
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        
        // Emit the status change event
        this.workItemStatusChanged.emit({
          workItemId: workItem.id,
          newStatus: newStatus
        });
        
        console.log('Status change event emitted');
      } else {
        console.log('No status change detected');
      }
    }
  }

  getStatusDisplayText(status: WorkItemStatus): string {
    return getWorkItemStatusDisplayText(status);
  }

  getPriorityDisplayText(priority: number): string {
    switch (priority) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      case 3: return 'Urgent';
      default: return 'Unknown';
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('');
  }

  onDragStarted(event: any): void {
    console.log('Drag started:', event);
    console.log('Dragged item:', event.source.data);
  }
}