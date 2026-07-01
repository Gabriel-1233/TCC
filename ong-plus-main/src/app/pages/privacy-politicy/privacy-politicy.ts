import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-privacy-politicy',
  imports: [CommonModule, Header, Footer],
  templateUrl: './privacy-politicy.html',
  styleUrl: './privacy-politicy.css'
})
export class PrivacyPoliticy {

}
