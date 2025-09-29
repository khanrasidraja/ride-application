import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-management',
  template: `
    <div class="page-container">
      <h1>User Management</h1>
      <mat-card>
        <mat-card-content>
          <p>User management functionality will be implemented here.</p>
          <p>Total Users: {{ totalUsers }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    h1 { margin-bottom: 20px; }
  `]
})
export class UserManagementComponent implements OnInit {
  totalUsers = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        this.totalUsers = response?.data?.length || 0;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }
}