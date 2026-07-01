import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { CampaignService } from '../../services/campanha.service';
import { ModelCampanha } from '../../models/campanha.models';
import { NewCampaignDialog } from '../../components/new-campaign-dialog/new-campaign-dialog';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
// campaigns.component.ts

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


import { MatTableDataSource } from '@angular/material/table';

import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-campaigns',
  standalone: true,
    imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // Angular Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    Footer,
    Header
  ],
  templateUrl: './campanhas.html',
  styleUrls: ['./campanhas.css']
})

export class Campanhas implements OnInit {
  campaigns: ModelCampanha[] = [];
  filteredCampaigns: ModelCampanha[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  categories = ['saúde', 'educação', 'meio ambiente', 'tecnologia', 'animais',
    'alimentos', 'roupas', 'dinheiro', 'sangue', 'brinquedos', 'outros'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private campaignService: CampaignService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  getCategoryName(category: string): string {
  const categoryNames: {[key: string]: string} = {
   'saúde':'saúde',
   'educação':'educação',
   'meio ambiente':'meio ambiente',
   'tecnologia':'tecnologia',
   'animais':'animais',
   'alimentos':'alimentos',
   'roupas':'roupas',
   'dinheiro':'dinheiro',
   'sangue':'sangue',
   'brinquedos':'brinquedos',
    'outros':'outros'
  };
  return categoryNames[category] || category;
}

getStatusName(status: string): string {
  const statusNames: {[key: string]: string} = {
    'ativa': 'Ativa',
    'encerrada': 'Encerrada',
    'suspensa': 'Suspensa'
  };
  return statusNames[status] || status;
}
  loadCampaigns(): void {
    this.loading = true;
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.filteredCampaigns = [...campaigns];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredCampaigns = this.campaigns.filter(campaign => {
      const matchesSearch = !this.searchTerm ||
        campaign.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campaign.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory ||
        campaign.categoria === this.selectedCategory;

      const matchesStatus = !this.selectedStatus ||
        campaign.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openNewCampaignDialog(): void {
    const dialogRef = this.dialog.open(NewCampaignDialog, {
      width: '800px',
      disableClose: true,
      data: { campaign: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCampaigns();
      }
    });
  }

  editCampaign(campaign: ModelCampanha): void {
    const dialogRef = this.dialog.open(NewCampaignDialog, {
      width: '800px',
      disableClose: true,
      data: { campaign }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCampaigns();
      }
    });
  }

  deleteCampaign(campaign: ModelCampanha): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a campanha "${campaign.titulo}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.campaignService.deleteCampaign(campaign._id).subscribe({
          next: () => {
            this.loadCampaigns();
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    });
  }
}
