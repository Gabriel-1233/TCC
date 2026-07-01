import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './termos-de-uso.html',
  styleUrls: ['./termos-de-uso.css']
})
export class Termos {}
