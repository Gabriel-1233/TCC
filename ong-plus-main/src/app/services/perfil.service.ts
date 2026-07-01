import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, OngUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000'; // corrigido

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<User | OngUser> {
    return this.http.get<User | OngUser>(`${this.apiUrl}/usuarios/${userId}`);
  }

  updateUserProfile(userId: string, userData: Partial<User | OngUser>): Observable<User | OngUser> {
  // Transforma os dados para o formato esperado pela API
  const payload = {
    ...userData,
    ...(userData.endereco && { endereco: userData.endereco }),
    ...(userData.tipo === 'ong' && {
      redesSociais: (userData as OngUser).redesSociais,
      areasAtuacao: (userData as OngUser).areasAtuacao
    })
  };

  return this.http.put<User | OngUser>(`${this.apiUrl}/usuarios/${userId}`, payload);
}

  uploadProfilePhoto(userId: string, photo: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post<{url: string}>(`${this.apiUrl}/usuarios/${userId}/photo`, formData);
  }
}
