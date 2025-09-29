import { Component } from '@angular/core';

@Component({
  selector: 'app-driver-management',
  template: `
    <div class="page-container">
      <h1>Driver Management</h1>
      <mat-card>
        <mat-card-content>
          <p>Driver management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    h1 { margin-bottom: 20px; }
  `]
})
export class DriverManagementComponent {}