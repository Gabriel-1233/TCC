import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { CampaignService } from '../../services/campanha.service';
import { ModelCampanha } from '../../models/campanha.models';
import { CampanhasCards } from '../../components/cards/cards';
import { Doacao } from '../doacao/doacao';
import { Donation } from '../../models/donation.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Header,
    Footer,
    CampanhasCards,
    Doacao,
    RouterLink
  ],
  templateUrl: './explorar.html',
  styleUrls: ['./explorar.css']
})
export class Explorar {
  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService
  ) {}

  showFilters = false;
  selectedTag = '';
  sortOption = 'recent';
  selectedLocation = '';
  searchTerm: string = '';

  featuredCampaigns: ModelCampanha[] = [];
  showDonationModal: boolean = false;
  selectedCampaign: ModelCampanha | null = null;



  ngOnInit() {
    this.loadCampaigns();
    this.route.queryParams.subscribe(params => {
      const campanhaId = params['campanha._id'];
      if (campanhaId) {
        this.openCampaignModalById(campanhaId);
      }
    });
  }

  openCampaignModalById(id: string) {
    const found = this.featuredCampaigns.find(c => c._id === id);
    if (found) {
      this.selectedCampaign = found;
      this.showDonationModal = true;
      document.body.style.overflow = 'hidden';
    }
  }

  loadCampaigns(): void {
    this.campaignService.getCampaigns().subscribe({
      next: (data) => {
        this.featuredCampaigns = data;
      },
      error: (err) => console.error('Erro ao buscar campanhas:', err)
    });
  }

  popularTags = ['saúde', 'educação', 'meio ambiente', 'tecnologia', 'animais', 'outros'];

  categories = [
    'saúde', 'educação', 'meio ambiente', 'tecnologia', 'animais',
    'alimentos', 'roupas', 'dinheiro', 'sangue', 'brinquedos', 'outros'
  ];
  selectedCategories: string[] = [];

  locations = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte',
    'Brasília', 'Bahia', 'Porto Alegre', 'Todas regiões'
  ];

  get filteredCauses() {
    let results = [...this.featuredCampaigns];

    if (this.searchTerm.trim()) {
      const keyword = this.searchTerm.trim().toLowerCase();
      results = results.filter(c =>
        c.titulo.toLowerCase().includes(keyword) ||
        c.descricao.toLowerCase().includes(keyword)
    )}

    if (this.selectedTag) {
      results = results.filter(c => c.categoria === this.selectedTag);
    }

    if (this.selectedCategories.length > 0) {
      results = results.filter(c => this.selectedCategories.includes(c.categoria));
    }

    if (this.selectedLocation) {
      results = results.filter(c => c.local.cidade === this.selectedLocation);
    }

    switch (this.sortOption) {
      case 'popular':
        return results.sort((a, b) => (b.avaliacaoCount || 0) - (a.avaliacaoCount || 0));
      case 'urgent':
        return results.sort((a, b) => new Date(a.dataFim).getTime() - new Date(b.dataFim).getTime());
      default:
        return results;
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  selectTag(tag: string) {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
  }

  getCategoryColor(category: string) {
    const colors: Record<string, string> = {
      'alimentos': '#FF9A76',
      'roupas': '#6A8CAF',
      'dinheiro': '#A7D7C5',
      'sangue': '#F47C7C',
      'brinquedos': '#86C166',
      'outros': '#C4A7CB'
    };
    return colors[category] || '#B08D57';
  }

  openDonationModal(campaign: ModelCampanha) {
    this.selectedCampaign = campaign;
    this.showDonationModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDonationModal() {
    this.showDonationModal = false;
    document.body.style.overflow = '';
  }

  handleDonationComplete(donation: Donation) {
    console.log("Doação realizada:", donation);
    this.closeDonationModal();
  }
}
