// Arquivo: register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private apiUrl = 'https://bug-free-xylophone-69rxgj47qvrrhqpp-3000.app.github.dev';

  constructor(private http: HttpClient) {}

  registerUser(doador: any): Observable<any> {
    return this.http.post(this.apiUrl, doador);
  }
}
