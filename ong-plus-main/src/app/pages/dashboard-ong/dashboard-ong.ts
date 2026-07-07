import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
Chart,
ChartConfiguration,
ChartData,
ChartType,
registerables
} from 'chart.js';

Chart.register(...registerables);

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
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'dashboard-ong',
  standalone: true,
  imports: [
  CommonModule,
  RouterModule,

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

  BaseChartDirective,

  Footer
],
  templateUrl: './dashboard-ong.html',
  styleUrls: ['./dashboard-ong.css']
})

export class DashboardOng implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective)
  chart?: BaseChartDirective;

  
  
  usuarioNome = '';
  email = '';
  avatarUrl = '';
  public barChartType = 'bar' as const;

public barChartData: ChartData<'bar'> = {
  labels: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ],
  datasets: [
    {
      label: 'Arrecadação',
      data: []
    }
  ]
};

public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true
};

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

  this.carregarGrafico();

  this.carregarAtividades();

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
  donors: data.donors || 0,
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

private carregarGrafico(): void {

  if (!this.email) return;

  this.ongDashboardService
    .getMonthlyDonations(this.email)
    .subscribe(dados => {

      console.log(dados);

      this.barChartData.datasets[0].data = dados;

      this.chart?.update();

    });

}

private carregarAtividades(): void {

  this.ongDashboardService
    .getActivities()
    .subscribe({

      next: (atividades) => {

        this.recentActivities = atividades;

      },

      error: (err) => {

        console.error(err);

      }

    });

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

  recentActivities: any[] = [];
}
