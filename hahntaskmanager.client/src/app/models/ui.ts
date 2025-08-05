// UI-related interfaces for components
export interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: any[]; // Using any[] since we're moving away from Task interface
} 