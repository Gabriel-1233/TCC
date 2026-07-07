// src/app/services/ong-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OngDashboardService {
  private baseUrl = 'https://bug-free-xylophone-69rxgj47qvrrhqpp-3000.app.github.dev/api';

  constructor(private http: HttpClient) {}

  getDashboardData(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-ong/${email}`);
  }

  getMonthlyDonations(email: string) {
  return this.http.get<number[]>(
    `${this.baseUrl}/donations/monthly/${email}`
  );
}

getActivities() {
  return this.http.get<any[]>(
    `${this.baseUrl}/atividades`
  );
}

}
