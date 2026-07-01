// src/app/services/ong-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OngDashboardService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDashboardData(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-ong/${email}`);
  }
}
