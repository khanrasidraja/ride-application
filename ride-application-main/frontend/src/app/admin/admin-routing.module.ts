import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { DriverManagementComponent } from './pages/driver-management/driver-management.component';
import { VehicleManagementComponent } from './pages/vehicle-management/vehicle-management.component';
import { RideManagementComponent } from './pages/ride-management/ride-management.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'drivers', component: DriverManagementComponent },
      { path: 'vehicles', component: VehicleManagementComponent },
      { path: 'rides', component: RideManagementComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }