import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}