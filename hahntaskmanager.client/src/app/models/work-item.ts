import { UserDto } from './user';
import { CommentDto } from './comment';

export interface WorkItemDto {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: WorkItemPriority;
  status: WorkItemStatus;
  assigneeId?: string;
  assigneeName?: string;
}

export interface WorkItemDetailDto {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: WorkItemPriority;
  status: WorkItemStatus;
  assignee?: UserDto;
  comments: CommentDto[];
}

export interface CreateUpdateWorkItemDto {
  title: string;
  description?: string;
  dueDate: Date;
  priority: WorkItemPriority;
  status: WorkItemStatus;
  assigneeId?: string;
  id?: string;
  comments?: CommentDto[];
}

export enum WorkItemPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

// Helper function to get display text for WorkItemPriority
export function getWorkItemPriorityDisplayText(priority: WorkItemPriority): string {
  switch (priority) {
    case WorkItemPriority.LOW:
      return 'Low';
    case WorkItemPriority.MEDIUM:
      return 'Medium';
    case WorkItemPriority.HIGH:
      return 'High';
    case WorkItemPriority.URGENT:
      return 'Urgent';
    default:
      return 'Unknown';
  }
}

export enum WorkItemStatus {
  TODO = 0,
  IN_PROGRESS = 1,
  DONE = 2,
  BLOCKED = 3
}

// Helper function to get display text for WorkItemStatus
export function getWorkItemStatusDisplayText(status: WorkItemStatus): string {
  switch (status) {
    case WorkItemStatus.TODO:
      return 'To Do';
    case WorkItemStatus.IN_PROGRESS:
      return 'In Progress';
    case WorkItemStatus.DONE:
      return 'Done';
    case WorkItemStatus.BLOCKED:
      return 'Blocked';
    default:
      return 'Unknown';
  }
}

export enum ViewType {
  GRID = 'grid',
  BOARD = 'board'
}