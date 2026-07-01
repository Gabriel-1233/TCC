import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Perfil } from "../perfil/perfil";

// // Services
// import { CampaignService } from '@app/core/services/campaign.service';
// import { DonationService } from '@app/core/services/donation.service';
// import { AuthService } from '@app/core/services/auth.service';

// // Components
// import { DonationDialogComponent } from './components/donation-dialog/donation-dialog.component';
// import { CampaignCardComponent } from '@app/shared/components/campaign-card/campaign-card.component';

// // Models
// import { Campaign } from '@app/core/models/campaign.model';
// import { Donation } from '@app/core/models/donation.model';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatBadgeModule,
    Header,
    Footer
   
],
  templateUrl: './dashboard-doador.html',
  styleUrls: ['./dashboard-doador.css']
})
export class DashboardDoador implements OnInit {
  // featuredCampaigns: Campaign[] = [];
  // recentCampaigns: Campaign[] = [];
  // userDonations: Donation[] = [];
  activeTabIndex = 0;
  loading = true;

  constructor(
    // private campaignService: CampaignService,
    // private donationService: DonationService,
    // private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Carrega campanhas em destaque
    // this.campaignService.getFeaturedCampaigns().subscribe(featured => {
    //   this.featuredCampaigns = featured;
    // });

    // Carrega campanhas recentes
    // this.campaignService.getRecentCampaigns().subscribe(recent => {
    //   this.recentCampaigns = recent;
    // });

    // Carrega doações do usuário
    // this.donationService.getUserDonations().subscribe(donations => {
    //   this.userDonations = donations;
    //   this.loading = false;
    // });
  }

  // getTotalDonated(): number {
  //   return this.userDonations.reduce((total, donation) => total + donation.amount, 0);
  // }

  // getBadgeCount(): number {
  //   // Lógica para calcular selos/conquistas
  //   return this.userDonations.length >= 5 ? 1 : 0;
  // }
}
