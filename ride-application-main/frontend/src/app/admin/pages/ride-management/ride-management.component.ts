import { Component } from '@angular/core';

@Component({
  selector: 'app-ride-management',
  template: `
    <div class="page-container">
      <h1>Ride Management</h1>
      <mat-card>
        <mat-card-content>
          <p>Ride management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    h1 { margin-bottom: 20px; }
  `]
})
export class RideManagementComponent {}