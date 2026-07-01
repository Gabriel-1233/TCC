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

  getImageUrl(): string {
    if (Array.isArray(this.campaign.imagem)) {
      return this.campaign.imagem[0] || 'assets/images/default-campaign.jpg';
    }
    return this.campaign.imagem || 'assets/images/default-campaign.jpg';
  }
}
