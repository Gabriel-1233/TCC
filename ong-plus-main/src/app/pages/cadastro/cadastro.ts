import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FormOng } from '../../components/form-ong/form-ong';
import { FormDoador } from '../../components/form-doador/form-doador';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FormOng,
    FormDoador,
    Header,
  Footer],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class Cadastro {
  abaSelecionada: 'ong' | 'doador' = 'ong';

}
