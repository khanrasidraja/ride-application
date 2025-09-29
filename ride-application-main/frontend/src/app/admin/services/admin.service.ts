import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private serverUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // User Management
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/logindata`, { headers });
  }

  deleteUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.serverUrl}/logindata/${userId}`, { headers });
  }

  updateUser(userId: string, userData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.serverUrl}/update/${userId}`, userData, { headers });
  }

  // Driver Management
  getAllDrivers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/driverdata`, { headers });
  }

  createDriver(driverData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.serverUrl}/driverdata`, driverData, { headers });
  }

  updateDriver(driverId: string, driverData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.serverUrl}/driverdata/${driverId}`, driverData, { headers });
  }

  deleteDriver(driverId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.serverUrl}/driverdata/${driverId}`, { headers });
  }

  // Vehicle Management
  getAllVehicles(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/vehicledata`, { headers });
  }

  createVehicle(vehicleData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.serverUrl}/vehicledata`, vehicleData, { headers });
  }

  updateVehicle(vehicleId: string, vehicleData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.serverUrl}/vehicledata/${vehicleId}`, vehicleData, { headers });
  }

  deleteVehicle(vehicleId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.serverUrl}/vehicledata/${vehicleId}`, { headers });
  }

  // Ride Management
  getAllRides(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/ridehistory`, { headers });
  }

  // Settings Management
  getSettings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/settingdata`, { headers });
  }

  updateSettings(settingsData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.serverUrl}/settingdata`, settingsData, { headers });
  }

  // Country Management
  getAllCountries(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/countrydata`, { headers });
  }

  // City Management
  getAllCities(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/citydata`, { headers });
  }

  // Pricing Management
  getAllPricing(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/pricingdata`, { headers });
  }

  updatePricing(pricingId: string, pricingData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.serverUrl}/pricingdata/${pricingId}`, pricingData, { headers });
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.serverUrl}/admin/dashboard-stats`, { headers });
  }
}