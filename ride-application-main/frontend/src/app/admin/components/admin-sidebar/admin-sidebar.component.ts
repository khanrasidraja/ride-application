import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'User Management', route: '/admin/users', icon: 'people' },
    { label: 'Driver Management', route: '/admin/drivers', icon: 'local_taxi' },
    { label: 'Vehicle Management', route: '/admin/vehicles', icon: 'directions_car' },
    { label: 'Ride Management', route: '/admin/rides', icon: 'commute' },
    { label: 'Reports', route: '/admin/reports', icon: 'assessment' },
    { label: 'Settings', route: '/admin/settings', icon: 'settings' }
  ];

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}