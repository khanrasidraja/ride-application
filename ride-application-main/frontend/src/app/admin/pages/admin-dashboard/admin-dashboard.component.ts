import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

interface DashboardStats {
  totalUsers: number;
  totalDrivers: number;
  totalRides: number;
  activeRides: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    activeRides: 0,
    totalRevenue: 0
  };

  isLoading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.isLoading = true;
    // Since there's no specific dashboard stats endpoint, we'll call multiple endpoints
    Promise.all([
      this.adminService.getAllUsers().toPromise(),
      this.adminService.getAllDrivers().toPromise(),
      this.adminService.getAllRides().toPromise()
    ]).then(([users, drivers, rides]) => {
      this.stats.totalUsers = users?.data?.length || 0;
      this.stats.totalDrivers = drivers?.data?.length || 0;
      this.stats.totalRides = rides?.data?.length || 0;
      this.stats.activeRides = rides?.data?.filter((ride: any) => ride.status === 'active')?.length || 0;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading dashboard stats:', error);
      this.isLoading = false;
    });
  }
}