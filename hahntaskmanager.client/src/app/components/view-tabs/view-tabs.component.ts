import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewType } from '../../models/work-item';

@Component({
  selector: 'app-view-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-tabs.component.html',
  styleUrls: ['./view-tabs.component.css']
})
export class ViewTabsComponent {
  @Input() currentView: ViewType = ViewType.GRID;
  @Output() viewChanged = new EventEmitter<ViewType>();

  switchView(view: string): void {
    const viewType = view === 'grid' ? ViewType.GRID : ViewType.BOARD;
    this.viewChanged.emit(viewType);
  }
}