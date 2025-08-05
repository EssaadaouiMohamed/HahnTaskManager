import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/ui';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.css']
})
export class ProjectHeaderComponent {
  @Output() newWorkItem = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() import = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();

  showDropdown = false;
  project: Project = {
    id: 'PRJ-2023-001',
    name: 'Website Redesign Project',
    description: 'Complete redesign of the company website',
    tasks: []
  };

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onNewWorkItem(): void {
    this.newWorkItem.emit();
  }

  onExport(): void {
    this.export.emit();
    this.showDropdown = false;
  }

  onImport(): void {
    this.import.emit();
    this.showDropdown = false;
  }

  onSettings(): void {
    this.settings.emit();
    this.showDropdown = false;
  }
}