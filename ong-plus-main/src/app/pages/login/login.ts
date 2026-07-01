import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  senha = '';
  erro = '';
  hidePassword = false;
  formSubmetido = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(form: NgForm): void {
    this.formSubmetido = true;

    if (form.invalid) {
      return;
    }

    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: (res) => {
        const user = res.user;
        const token = res.token;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('token', token || '');
        localStorage.setItem('usuarioNome', user?.nome || 'Usuário');
        localStorage.setItem('avatarUrl', user?.fotoPerfil || '');
        localStorage.setItem('tipoUsuario', user?.tipo || '');

        window.dispatchEvent(new Event("storage"));

        if (user?.tipo === 'doador') {
          this.router.navigate(['/perfil']);
        } else if (user?.tipo === 'ong') {
          this.router.navigate(['/dashboard-ong']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.erro = 'E-mail ou senha inválidos!';
        console.error(err);
      },
    });
  }
}
