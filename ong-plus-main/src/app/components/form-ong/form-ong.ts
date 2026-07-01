// src/app/pages/form-ong/form-ong.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-form-ong',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, RouterLink],
  templateUrl: './form-ong.html',
  styleUrls: ['./form-ong.css']
})
export class FormOng {
  constructor(private router: Router) {}

  ong = {
    nome: '',
    cnpj: '',
    email: '',
    senha: '',
    telefone: '',
    areaAtuacao: '',
    endereco: '',
    site: '',
    descricao: '',
    aceitouTermos: false
  };

  cnpjValido = true;
  senhaValida = true;

  areasAtuacao = [
    'Animais',
    'Crianças',
    'Educação',
    'Meio Ambiente',
    'Saúde',
    'Direitos Humanos'
  ];

  cadastrarOng(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.cnpjValido = this.validarCNPJ(this.ong.cnpj);
    this.senhaValida = this.validarSenha(this.ong.senha);

    if (!this.cnpjValido || !this.senhaValida) return;

    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...this.ong, tipo: 'ong' })
    })
    .then(res => res.json())
    .then(res => {
      localStorage.setItem('token', res.token || '');
      localStorage.setItem('usuarioNome', res.user?.nome || 'Minha ONG');
      localStorage.setItem('avatarUrl', res.user?.fotoPerfil || '/ong-exemplo.svg');
      localStorage.setItem('tipoUsuario', res.user?.tipo || 'ong');
      localStorage.setItem('email', res.user?.email || '');
      window.dispatchEvent(new Event("storage"));
      this.router.navigate(['/dashboard-ong']);
    })
    .catch(err => {
      console.error('Erro ao cadastrar ONG:', err);
      alert('Erro ao registrar a ONG. Tente novamente mais tarde.');
    });
  }

  validarCNPJ(cnpj: string): boolean {
    if (!cnpj) return false;
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros[tamanho - i] * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== +digitos[0]) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros[tamanho - i] * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === +digitos[1];
  }

  validarSenha(senha: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(senha);
  }

  onCnpjChange(value: string) {
    this.ong.cnpj = value;
    this.cnpjValido = this.validarCNPJ(value);
  }
}
