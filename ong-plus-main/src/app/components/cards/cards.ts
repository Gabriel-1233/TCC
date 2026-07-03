import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModelCampanha } from '../../models/campanha.models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Doacao } from '../../pages/doacao/doacao';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CommonModule, RouterModule, Doacao],
  templateUrl: './cards.html',
  styleUrls: ['./cards.css']
})
export class CampanhasCards {
  @Input({ required: true }) campaign!: ModelCampanha;
  @Output() donate = new EventEmitter<ModelCampanha>();

  showPremiumModal = false;
  showDonationModal = false;

  getProgressPercentage(): number {
    return this.campaign.meta > 0
      ? (this.campaign.arrecadado / this.campaign.meta) * 100
      : 0;
  }

  openPremiumModal(): void {
    this.showPremiumModal = true;
    document.body.style.overflow = 'hidden';
  }

  openDonationModal(event?: Event): void {
    event?.stopPropagation();
    this.showPremiumModal = false;
    this.showDonationModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(event?: Event): void {
    event?.stopPropagation?.();
    this.showPremiumModal = false;
    this.showDonationModal = false;
    document.body.style.overflow = '';
  }

  handleDonationComplete(donation: any): void {
    this.closeModal();
    this.donate.emit(this.campaign);
  }

  truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'saúde': '#ff6b6b',
    'educação': '#4dabf7',
    'meio ambiente': '#51cf66',
    'tecnologia': '#845ef7',
    'animais': '#f59f00',
    'alimentos': '#fd7e14',
    'roupas': '#e64980',
    'dinheiro': '#20c997',
    'sangue': '#c92a2a',
    'brinquedos': '#fcc419',
    'outros': '#868e96'
  };

  return colors[category] || '#0d6efd';
}

  getImageUrl(): string {

  console.log("Campanha completa:", this.campaign);
  console.log("Campo imagem:", this.campaign.imagem);

  if (Array.isArray(this.campaign.imagem)) {
    console.log("Primeira imagem:", this.campaign.imagem[0]);
    return this.campaign.imagem[0] || 'assets/images/default-campaign.jpg';
  }

  console.log("Imagem string:", this.campaign.imagem);
  return this.campaign.imagem || 'assets/images/default-campaign.jpg';
}

  ngOnInit() {
  console.log("CARD", this.campaign);
}
}
