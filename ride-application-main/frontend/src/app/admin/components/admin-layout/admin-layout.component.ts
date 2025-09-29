import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  sidenavOpened = true;

  constructor(private router: Router) {}

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}