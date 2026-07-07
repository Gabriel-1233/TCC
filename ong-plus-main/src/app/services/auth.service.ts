import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://bug-free-xylophone-69rxgj47qvrrhqpp-3000.app.github.dev';

  constructor(private http: HttpClient, private router: Router) {}

  login(user: { email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((res: any) => {
  if (res && res.user) {

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));

    // Dados individuais utilizados em várias telas
    const usuarioId = localStorage.getItem("_id");
    localStorage.setItem('usuarioNome', res.user.nome);
    localStorage.setItem('email', res.user.email);

    if (res.user.fotoPerfil) {
  localStorage.setItem('avatarUrl', res.user.fotoPerfil);
}

  }
})
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  getUserType(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.tipo || null; // 'tipo' deve ser o campo com o tipo do usuário, ex: 'doador' ou 'ong'
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
