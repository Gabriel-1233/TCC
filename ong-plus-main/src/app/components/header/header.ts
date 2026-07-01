import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  readonly panelOpenState = signal(false);
  logado = false;
  tipoUsuario: string | null = null;
  usuarioNome: string | null = null;
  avatarUrl: string | null = null;
  mostrarBusca = false;
  busca = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.atualizarEstado();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.atualizarEstado();
    });

    window.addEventListener('storage', () => this.atualizarEstado());
  }

  atualizarEstado() {
    this.logado = !!localStorage.getItem('token');
    this.tipoUsuario = localStorage.getItem('tipoUsuario');
    this.usuarioNome = localStorage.getItem('usuarioNome');
    this.avatarUrl = localStorage.getItem('avatarUrl');
    this.mostrarBusca = this.router.url === '/explorar';
  }

  logout() {
    localStorage.clear();
    this.atualizarEstado();
    this.router.navigate(['/login']);
  }
}
