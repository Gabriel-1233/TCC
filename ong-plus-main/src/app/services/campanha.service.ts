import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelCampanha } from '../models/campanha.models';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  // ✅ Substitua pela URL da API publicada no Vercel (sem barra no final)
  private readonly baseUrl = 'http://localhost:3000/api/campanhas';

  constructor(private http: HttpClient) {}

  getCampaigns(): Observable<ModelCampanha[]> {
    return this.http.get<ModelCampanha[]>(this.baseUrl);
  }

  getCampaignById(id: string): Observable<ModelCampanha> {
    return this.http.get<ModelCampanha>(`${this.baseUrl}/${id}`);
  }

 createCampaign(campaign: any): Observable<any> {
  return this.http.post(this.baseUrl, campaign);
}

updateCampaign(id: string, campaign: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, campaign);
}


  deleteCampaign(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
