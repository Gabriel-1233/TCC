import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-quem-somos',
  standalone: true,
  imports: [Header, Footer, CommonModule, FontAwesomeModule],
  templateUrl: './quem-somos.html',
  styleUrls: ['./quem-somos.css']
})
export class QuemSomos {
  // Valores para exibição
  values = [
    { name: 'Integridade', icon: 'shield-check', color: 'primary' },
    { name: 'Inovação', icon: 'lightbulb', color: 'info' },
    { name: 'Excelência', icon: 'star-fill', color: 'warning' },
    { name: 'Colaboração', icon: 'people-fill', color: 'success' },
    { name: 'Transparência', icon: 'journal-text', color: 'danger' },
    { name: 'Empatia', icon: 'heart-fill', color: 'purple' },
    { name: 'Inclusão', icon: 'globe2', color: 'secondary' },
    { name: 'Compromisso social', icon: 'hand-thumbs-up-fill', color: 'dark' }
  ];

  // Equipe
  team = [
    { name: 'Bruno Henrique Alves Santos', role: 'Desenvolvedor Front-end', avatar: 'minha_foto.jpeg' },
    // { name: 'Aiana Santos de Deus Lima', role: 'UX/UI Designer', avatar: 'avatar2.jpg' },
    // { name: 'Arauna Noemi dos Santos', role: 'Desenvolvedora Back-end', avatar: 'avatar3.jpg' },
    // { name: 'Arthur Fraga de Oliveira', role: 'Product Manager', avatar: 'avatar4.jpg' },
    // { name: 'Welson Gabriel Piagio Reis Santos', role: 'Full-stack Developer', avatar: 'avatar5.jpg' }
  ];
}