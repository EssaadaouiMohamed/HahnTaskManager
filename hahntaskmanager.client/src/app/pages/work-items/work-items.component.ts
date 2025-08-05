import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { WorkItemService } from '../../services/task.service';
import { WorkItemDto, WorkItemStatus } from '../../models/work-item';
import { ViewType } from '../../models/work-item';
import { GetWorkItemsQuery } from '../../models/query';

import { HeaderComponent } from '../../components/header/header.component';
import { ProjectHeaderComponent } from '../../components/project-header/project-header.component';
import { ViewTabsComponent } from '../../components/view-tabs/view-tabs.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { GridViewComponent } from '../../components/grid-view/grid-view.component';
import { BoardViewComponent } from '../../components/board-view/board-view.component';
import { WorkItemFormComponent } from '../../components/work-item-form/work-item-form.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-work-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    HeaderComponent,
    ProjectHeaderComponent,
    ViewTabsComponent,
    FilterBarComponent,
    GridViewComponent,
    BoardViewComponent,
    WorkItemFormComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './work-items.component.html',
  styleUrls: ['./work-items.component.css']
})
export class WorkItemsComponent implements OnInit {
  title = 'TaskFlow - Project Management';
  
  // Expose ViewType enum to template
  ViewType = ViewType;
  
  workItems: WorkItemDto[] = [];
  currentView: ViewType = ViewType.GRID;
  showWorkItemForm = false;
  selectedWorkItem: WorkItemDto | undefined = undefined;
  isEditMode = false;
  isLoading = false;
  showDeleteConfirmation = false;
  workItemToDelete: WorkItemDto | undefined = undefined;

  // Current query state
  currentQuery: GetWorkItemsQuery = {
    pageNumber: 1,
    pageSize: 10
  };

  constructor(private workItemService: WorkItemService) {}

  ngOnInit(): void {
    this.loadWorkItems();
    this.workItemService.currentView$.subscribe(view => {
      this.currentView = view;
    });
  }



  onViewChanged(view: ViewType): void {
    this.workItemService.setView(view);
    this.currentView = view;
  }

  onFilterChanged(query: GetWorkItemsQuery): void {
    // Merge the new query with current state
    this.currentQuery = {
      ...this.currentQuery,
      ...query,
      pageNumber: 1 // Reset to first page when filtering
    };
    this.loadWorkItems();
  }

  onSortChanged(query: GetWorkItemsQuery): void {
    // Merge the new query with current state
    this.currentQuery = {
      ...this.currentQuery,
      ...query,
      pageNumber: 1 // Reset to first page when sorting
    };
    this.loadWorkItems();
  }

  onWorkItemAction(workItem: WorkItemDto): void {
    console.log('Work item action:', workItem);
    // Handle work item actions (edit, delete, etc.)
  }

  onEditWorkItem(workItem: WorkItemDto): void {
    console.log('Edit work item:', workItem);
    this.selectedWorkItem = workItem;
    this.isEditMode = true;
    this.showWorkItemForm = true;
  }

  onDeleteWorkItem(workItem: WorkItemDto): void {
    console.log('Delete work item:', workItem);
    this.workItemToDelete = workItem;
    this.showDeleteConfirmation = true;
  }

  onWorkItemStatusChanged(event: {workItemId: string, newStatus: WorkItemStatus}): void {
    console.log('Work item status changed:', event);
    this.workItemService.changeWorkItemStatus(event.workItemId, event.newStatus).subscribe({
      next: () => {
        console.log('Work item status updated successfully');
        // Reload work items to reflect the change
        this.loadWorkItems();
      },
      error: (error) => {
        console.error('Error updating work item status:', error);
        // Optionally revert the UI change or show error message
      }
    });
  }

  onNewWorkItem(): void {
    this.selectedWorkItem = undefined;
    this.isEditMode = false;
    this.showWorkItemForm = true;
  }

  onExport(): void {
    console.log('Export work items');
    // Handle export functionality
  }

  onImport(): void {
    console.log('Import work items');
    // Handle import functionality
  }

  onSettings(): void {
    console.log('Open settings');
    // Handle settings
  }

  onWorkItemFormSaved(): void {
    this.showWorkItemForm = false;
    this.selectedWorkItem = undefined;
    this.isEditMode = false;
    // Reload work items from server
    this.loadWorkItems();
  }

  onDeleteConfirmed(): void {
    if (this.workItemToDelete) {
      console.log('Deleting work item:', this.workItemToDelete.id);
      this.workItemService.deleteWorkItem(this.workItemToDelete.id).subscribe({
        next: () => {
          console.log('Work item deleted successfully');
          this.showDeleteConfirmation = false;
          this.workItemToDelete = undefined;
          // Reload work items from server
          this.loadWorkItems();
        },
        error: (error) => {
          console.error('Error deleting work item:', error);
          this.showDeleteConfirmation = false;
          this.workItemToDelete = undefined;
        }
      });
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirmation = false;
    this.workItemToDelete = undefined;
  }

  private loadWorkItems(): void {
    this.isLoading = true;
    this.workItemService.getWorkItems(this.currentQuery).subscribe({
      next: (result) => {
        this.workItems = result.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading work items:', error);
        this.workItems = [];
        this.isLoading = false;
      }
    });
  }
} 
