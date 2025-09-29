import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { DriverManagementComponent } from './pages/driver-management/driver-management.component';
import { VehicleManagementComponent } from './pages/vehicle-management/vehicle-management.component';
import { RideManagementComponent } from './pages/ride-management/ride-management.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    UserManagementComponent,
    DriverManagementComponent,
    VehicleManagementComponent,
    RideManagementComponent,
    SettingsComponent,
    ReportsComponent,
    AdminHeaderComponent,
    AdminSidebarComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ]
})
export class AdminModule { }