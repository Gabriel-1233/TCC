import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  keyframes
} from '@angular/animations';
import { CampaignService } from '../../services/campanha.service';
import { ModelCampanha } from '../../models/campanha.models';

import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stagger', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('typingAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 })),
        animate('3s ease-in-out', keyframes([
          style({ transform: 'translateY(0)' }),
          style({ transform: 'translateY(-5px)' }),
          style({ transform: 'translateY(0)' })
        ]))
      ])
    ]),

    trigger('ctaAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.8s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class Home implements OnInit, OnDestroy {
  private campaignService = inject(CampaignService);

  featuredCampaigns: ModelCampanha[] = [];
  activeTestimonial = 0;
  currentSlide = 0;
  isScrolled = false;
  totalCampanhas = 0;
  totalArrecadado = 0;

  private testimonialInterval?: ReturnType<typeof setInterval>;
  private typingTimeout?: ReturnType<typeof setTimeout>;

  // Textos animados para a hero section
  typedTexts = [
    'boas intenções em ações reais',
    'solidariedade em resultados',
    'compaixão em mudança'
  ];
  currentTypedIndex = 0;
  currentText = '';
  isDeleting = false;
  typingSpeed = 100;
  deletingSpeed = 50;
  pauseBetween = 2000;

  howItWorksSteps = [
    {
      title: 'Explore',
      description: 'Encontre causas que combinam com você',
      icon: 'bi-search',
      color: 'primary'
    },
    {
      title: 'Contribua',
      description: 'De várias formas diferentes',
      icon: 'bi-heart',
      color: 'danger'
    },
    {
      title: 'Acompanhe',
      description: 'Veja o impacto da sua ajuda',
      icon: 'bi-graph-up',
      color: 'success'
    }
  ];

  testimonials = [
    {
      text: 'ONG+ mudou a realidade da nossa comunidade. Com as doações, construímos um centro comunitário que atende 200 crianças diariamente.',
      author: 'Carlos Silva',
      role: 'Líder Comunitário',
      avatar: '/carlos.jpg'
    },
    {
      text: 'Como voluntária, encontrei propósito e uma rede de pessoas incríveis trabalhando por um mundo melhor.',
      author: 'Ana Paula',
      role: 'Voluntária',
      avatar: '/juliana.jpg'
    }
  ];

  impactStats = [
    { value: '1.2M+', label: 'Pessoas impactadas', icon: 'bi-people-fill' },
    { value: 'R$ 3.5M', label: 'Arrecadados', icon: 'bi-currency-dollar' },
    { value: '24.5k', label: 'Voluntários', icon: 'bi-heart-fill' }
  ];
    slides = [
  {
    imagem: '/banner1.jpg',
    titulo: 'Conectando solidariedade',
    descricao: 'ONG+ aproxima quem quer ajudar de quem precisa de ajuda.',
    botaoTexto: 'Cadastre sua ONG',
    link: '/cadastrar'
  },
  {
    imagem: '/banner2.jpg',
    titulo: 'Seja um doador transformador',
    descricao: 'Com poucos cliques você apoia causas reais.',
    botaoTexto: 'Ver campanhas',
    link: '/explorar'
  },
  {
    imagem: '/banner3.jpg',
    titulo: 'Junte-se ao movimento',
    descricao: 'Faça parte você também!',
    botaoTexto: 'Saiba mais',
    link: '/cadastrar'
  }
];
  ngOnInit() {
    this.loadCampaigns();
    this.startTestimonialRotation();
    this.initTypingAnimation();
  }

  loadCampaigns() {
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {

  this.featuredCampaigns = data.slice(0, 3);

  this.totalCampanhas = data.length;

  this.totalArrecadado = data.reduce(
    (total, campanha) => total + campanha.arrecadado,
    0
  );

},
      error: (err) => console.error('Erro ao buscar campanhas:', err)
    });
  }

  startTestimonialRotation(): void {

  this.testimonialInterval = setInterval(() => {

    this.activeTestimonial =
      (this.activeTestimonial + 1) %
      this.testimonials.length;

  }, 5000);

}

initTypingAnimation(): void {

  const type = () => {

    const fullText = this.typedTexts[this.currentTypedIndex];

    if (this.isDeleting) {

      this.currentText = fullText.substring(
        0,
        this.currentText.length - 1
      );

    } else {

      this.currentText = fullText.substring(
        0,
        this.currentText.length + 1
      );

    }

    let typeSpeed =
      this.isDeleting
        ? this.deletingSpeed
        : this.typingSpeed;

    if (!this.isDeleting && this.currentText === fullText) {

      typeSpeed = this.pauseBetween;
      this.isDeleting = true;

    } else if (this.isDeleting && this.currentText === '') {

      this.isDeleting = false;

      this.currentTypedIndex =
        (this.currentTypedIndex + 1) %
        this.typedTexts.length;

    }

    this.typingTimeout = setTimeout(type, typeSpeed);

  };

  this.typingTimeout = setTimeout(type, this.typingSpeed);

}

  nextSlide(): void {

  if (!this.featuredCampaigns.length) {
    return;
  }

  this.currentSlide =
    (this.currentSlide + 1) %
    this.featuredCampaigns.length;

}

  prevSlide(): void {

  if (!this.featuredCampaigns.length) {
    return;
  }

  this.currentSlide =
    (this.currentSlide - 1 + this.featuredCampaigns.length) %
    this.featuredCampaigns.length;

}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  ngOnDestroy(): void {

  if (this.testimonialInterval) {
    clearInterval(this.testimonialInterval);
  }

  if (this.typingTimeout) {
    clearTimeout(this.typingTimeout);
  }

}
}
