import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkItemDto, WorkItemDetailDto, CreateUpdateWorkItemDto, WorkItemPriority, WorkItemStatus } from '../../models/work-item';
import { CommentDto } from '../../models/comment';
import { UserDto } from '../../models/user';
import { WorkItemService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-work-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-item-form.component.html',
  styleUrls: ['./work-item-form.component.css']
})
export class WorkItemFormComponent implements OnInit {
  @Input() workItem?: WorkItemDto | WorkItemDetailDto;
  @Input() isEditMode = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  comments: CommentDto[] = [];
  currentUserId: string | undefined = '';
  isOpen = true; // Add missing property
  users: UserDto[] = []; // Add missing property

  priorities = [
    { value: WorkItemPriority.LOW, label: 'Low' },
    { value: WorkItemPriority.MEDIUM, label: 'Medium' },
    { value: WorkItemPriority.HIGH, label: 'High' },
    { value: WorkItemPriority.URGENT, label: 'Urgent' }
  ];

  statuses = [
    { value: WorkItemStatus.TODO, label: 'To Do' },
    { value: WorkItemStatus.IN_PROGRESS, label: 'In Progress' },
    { value: WorkItemStatus.DONE, label: 'Done' },
    { value: WorkItemStatus.BLOCKED, label: 'Blocked' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: WorkItemService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: [WorkItemPriority.LOW, Validators.required],
      status: [WorkItemStatus.TODO, Validators.required],
      assigneeId: [''],
      comments: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserValue()?.id;
    
    // Load users for assignee dropdown
    this.loadUsers();

    console.log('WorkItemForm: ngOnInit called with workItem:', this.workItem, 'isEditMode:', this.isEditMode);

    if (this.workItem) {
      // Format the date for the input field (YYYY-MM-DD format)
      const dueDate = this.workItem.dueDate ? new Date(this.workItem.dueDate).toISOString().split('T')[0] : '';
      
      // Handle assigneeId - WorkItemDto has assigneeId, WorkItemDetailDto has assignee object
      let assigneeId: string | undefined;
      if ('assigneeId' in this.workItem) {
        // This is WorkItemDto
        assigneeId = (this.workItem as WorkItemDto).assigneeId;
      } else if ('assignee' in this.workItem && this.workItem.assignee) {
        // This is WorkItemDetailDto
        assigneeId = (this.workItem as WorkItemDetailDto).assignee?.id;
      }
      
      this.form.patchValue({
        title: this.workItem.title,
        description: this.workItem.description,
        dueDate: dueDate,
        priority: Number(this.workItem.priority),
        status: Number(this.workItem.status),
        assigneeId: assigneeId
      });
      
      console.log('WorkItemForm: Form patched with values:', this.form.value);
      
      // Load comments if editing
      this.loadComments();
    }

    // Always fetch detailed data if we're in edit mode to get comments and other details
    if (this.isEditMode && this.workItem) {
      console.log('WorkItemForm: Fetching detailed work item data for editing');
      this.taskService.getWorkItemById(this.workItem.id).subscribe({
        next: (detail: WorkItemDetailDto) => {
          console.log('WorkItemForm: Received detailed work item:', detail);
          // Format the date for the input field
          const dueDate = detail.dueDate ? new Date(detail.dueDate).toISOString().split('T')[0] : '';
          
          this.form.patchValue({
            title: detail.title,
            description: detail.description,
            dueDate: dueDate,
            priority: Number(detail.priority),
            status: Number(detail.status),
            assigneeId: detail.assignee?.id
          });
          
          this.comments = detail.comments || [];
        },
        error: (error) => {
          console.error('WorkItemForm: Error fetching work item details:', error);
        }
      });
    }
  }

  get commentsArray(): FormArray {
    return this.form.get('comments') as FormArray;
  }

  addComment(text: string): void {
    if (text.trim()) {
      const comment: CommentDto = {
        text
      };
      this.comments.push(comment);
      this.commentsArray.push(this.fb.control(comment));
    }
  }

  removeComment(index: number): void {
    this.comments.splice(index, 1);
    this.commentsArray.removeAt(index);
  }

  editComment(comment: CommentDto): void {
    // Only allow if comment.createdById === currentUserId
    if (comment.author?.id !== this.currentUserId) return;
    // Implement edit logic
  }

  deleteComment(comment: CommentDto): void {
    if (comment.author?.id !== this.currentUserId) return;
    // Implement delete logic
  }

  // Add missing submit method that template references
  submit(): void {
    if (this.form.valid) {
      this.save();
    }
  }

  // Add missing close method that template references
  close(): void {
    this.cancel();
  }

  save(): void {
    if (this.form.valid) {
      // Ensure enum values are sent as numbers, not strings
      const dto: CreateUpdateWorkItemDto = {
        title: this.form.value.title,
        description: this.form.value.description,
        dueDate: this.form.value.dueDate,
        priority: Number(this.form.value.priority),
        status: Number(this.form.value.status),
        assigneeId: this.form.value.assigneeId,
        comments: this.comments // Include comments in DTO for server-side management
      };
      
      console.log('WorkItemForm: Saving work item with DTO:', dto);
      console.log('WorkItemForm: Form values before conversion:', this.form.value);
      console.log('WorkItemForm: isEditMode:', this.isEditMode, 'workItem ID:', this.workItem?.id);
      
      if (this.isEditMode && this.workItem) {
        console.log('WorkItemForm: Updating existing work item');
        this.taskService.updateWorkItem(this.workItem.id, dto).subscribe({
          next: () => {
            console.log('WorkItemForm: Work item updated successfully');
            this.saved.emit();
            this.isOpen = false;
          },
          error: (error) => {
            console.error('WorkItemForm: Error updating work item:', error);
          }
        });
      } else {
        console.log('WorkItemForm: Creating new work item');
        this.taskService.createWorkItem(dto).subscribe({
          next: () => {
            console.log('WorkItemForm: Work item created successfully');
            this.saved.emit();
            this.isOpen = false;
          },
          error: (error) => {
            console.error('WorkItemForm: Error creating work item:', error);
          }
        });
      }
    } else {
      console.log('WorkItemForm: Form is invalid:', this.form.errors);
    }
  }

  cancel(): void {
    this.isOpen = false;
    this.cancelled.emit();
  }

  private loadComments(): void {
    if (this.workItem && 'comments' in this.workItem) {
      const detailWorkItem = this.workItem as WorkItemDetailDto;
      this.comments = detailWorkItem.comments || [];
      this.comments.forEach(comment => this.commentsArray.push(this.fb.control(comment)));
    }
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Fallback to empty array if API call fails
        this.users = [];
      }
    });
  }
}
