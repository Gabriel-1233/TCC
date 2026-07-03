import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Donation } from '../models/donation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'https://bug-free-xylophone-69rxgj47qvrrhqpp-3000.app.github.dev/api/donations';

  constructor(private http: HttpClient) {}

  createDonation(donation: Donation): Observable<Donation> {
  return this.http.post<Donation>(this.apiUrl, donation);
}
}