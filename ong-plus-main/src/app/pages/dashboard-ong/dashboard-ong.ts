import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Breakpoint Observer
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Footer } from '../../components/footer/footer';
import { OngDashboardService } from '../../services/ongdashboard.service';

@Component({
  selector: 'dashboard-ong',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Angular Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    Footer
  ],
  templateUrl: './dashboard-ong.html',
  styleUrls: ['./dashboard-ong.css']
})
export class DashboardOng implements OnInit, OnDestroy {
  usuarioNome = '';
  email = '';
  avatarUrl = '';

  currentOng: any = {
    verified: true,
    mission: 'Transformando vidas desde 2010',
    monthlyGoal: 75,
    campaigns: 0,
    donations: 0,
    volunteers: 0
  };

  isHandset = false;
  sidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  loading = false;

  pageTitle = 'Painel da ONG';
  unreadNotifications = 3;

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private ongDashboardService: OngDashboardService
  ) {}

  ngOnInit(): void {
    this.carregarDadosDoLocalStorage();
    this.carregarDadosDaApi();
    this.setupResponsiveLayout();
    this.setupRouterEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private carregarDadosDoLocalStorage(): void {
    this.usuarioNome = localStorage.getItem('usuarioNome') || 'Minha ONG';
    this.email = localStorage.getItem('email') || '';
    this.avatarUrl = localStorage.getItem('avatarUrl') || '/ong-exemplo.svg';
  }

  private carregarDadosDaApi(): void {
    if (!this.email) return;

    this.ongDashboardService.getDashboardData(this.email).subscribe({
      next: (data) => {
        this.currentOng = {
          verified: true,
          mission: data.mission || 'Impactando vidas com solidariedade',
          monthlyGoal: data.monthlyGoal || 75,
          campaigns: data.campaigns || 0,
          donations: data.donations || 0,
          volunteers: data.volunteers || 0
        };
      },
      error: (err) => {
        console.error('Erro ao buscar dados do dashboard:', err);
      }
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  markNotificationAsRead(): void {
    if (this.unreadNotifications > 0) {
      this.unreadNotifications--;
    }
  }

  logout(): void {
    this.loading = true;
    setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/h']);
      this.loading = false;
    }, 800);
  }

  private setupResponsiveLayout(): void {
    this.subscriptions.add(
      this.breakpointObserver.observe([
        Breakpoints.Handset,
        Breakpoints.TabletPortrait
      ]).subscribe(result => {
        this.isHandset = result.matches;
        this.sidenavMode = this.isHandset ? 'over' : 'side';
        this.sidenavOpened = !this.isHandset;
      })
    );
  }

  private setupRouterEvents(): void {
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updatePageTitle();
      })
    );
  }

  private updatePageTitle(): void {
    const routeTitles: {[key: string]: string} = {
      '/campanhas': 'Campanhas',
      '/doacoes': 'Doações',
      '/configuracoes': 'Configurações'
    };

    this.pageTitle = routeTitles[this.router.url] || 'Painel da ONG';
  }

  getDonationTrend() {
    return { icon: 'trending_up', value: '+22%', positive: true };
  }

  getVolunteerTrend() {
    return { icon: 'trending_down', value: '-3%', positive: false };
  }

  getCampaignTrend() {
    return { icon: 'trending_up', value: '+5%', positive: true };
  }

  recentActivities = [
    // {
    //   user: 'Maria Silva',
    //   action: 'doou R$ 200 para Campanha A',
    //   time: '2 horas atrás',
    //   avatar: 'logo-ong-white.svg'
    // },
    // {
    //   user: 'João Oliveira',
    //   action: 'se voluntariou para Evento B',
    //   time: 'Ontem, 15:30',
    //   avatar: 'logo-ong-white.svg'
    // },
    // {
    //   entity: 'ONG',
    //   action: 'publicou nova campanha: Ajuda Animal',
    //   time: '5 de Out, 2023',
    //   initials: 'NG'
    // }
  ];
}
