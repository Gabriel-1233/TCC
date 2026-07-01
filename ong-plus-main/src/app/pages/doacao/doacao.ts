import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doacao.html',
  styleUrls: ['./doacao.css']
})
export class Doacao {
  @Input() campaignId: string = '';
  @Input() campaignTitle: string = '';
  @Input() campaignImage: string = '';
  @Output() donationComplete = new EventEmitter<Donation>();
  @Output() closeModal = new EventEmitter<void>();

  donation: Partial<Donation> = {
    valor: 50,
    mensagem: '',
    anonima: false
  };

  donationAmounts = [30, 50, 100, 200, 500];
  customAmount: number | null = null;
  paymentMethods = ['credit_card', 'pix', 'bank_slip'];
  selectedPaymentMethod: string = 'credit_card';
  currentStep: number = 1;
  isLoading: boolean = false;
  donationSuccess: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private donationService: DonationService,
    private router: Router
  ) {}

  // Seleciona valor pré-definido
  selectAmount(amount: number): void {
    this.donation.valor = amount;
    this.customAmount = null;
  }

  // Define valor customizado
  setCustomAmount(): void {
    if (this.customAmount && this.customAmount > 0) {
      this.donation.valor = this.customAmount;
    }
  }

  // Avança para o próximo passo
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.submitDonation();
    }
  }

  // Volta para o passo anterior
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = null;
    }
  }

  // Submete a doação para o servidor
  submitDonation(): void {
    if (!this.donation.valor || this.donation.valor <= 0) {
      this.errorMessage = 'Por favor, insira um valor válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const completeDonation: Donation = {
      ...this.donation as Donation,
      campanha: {
        _id: this.campaignId,
        titulo: this.campaignTitle,
        imagem: this.campaignImage
      },
      dataDoacao: new Date()
    };

    this.donationService.createDonation(completeDonation).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.donationSuccess = true;
        this.donationComplete.emit(response);
      },
      error: (err) => {
        console.error('Erro ao realizar doação:', err);
        this.errorMessage = 'Ocorreu um erro ao processar sua doação. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  // Finaliza o processo de doação
  finishDonation(): void {
    this.closeModal.emit();
    this.router.navigate(['/campaigns', this.campaignId]);
  }

  // Fecha o modal
  handleClose(): void {
    this.closeModal.emit();
  }

  // Calcula taxa de serviço (2.99% + R$0.50)
  calculateFee(): number {
    const value = this.donation.valor || 0;
    return Math.min(value * 0.0299 + 0.5, 10); // Máximo de R$10 de taxa
  }

  // Gera código fictício para o comprovante
  generateReceiptCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Retorna data atual formatada
  getCurrentDate(): Date {
    return new Date();
  }

  // Obtém ícone para o método de pagamento
  getPaymentMethodIcon(method: string): string {
    const icons: {[key: string]: string} = {
      'credit_card': 'bi bi-credit-card',
      'pix': 'bi bi-qr-code',
      'bank_slip': 'bi bi-upc-scan'
    };
    return icons[method] || 'bi bi-credit-card';
  }

  // Obtém nome amigável para o método de pagamento
  getPaymentMethodName(method: string): string {
    const names: {[key: string]: string} = {
      'credit_card': 'Cartão de Crédito',
      'pix': 'PIX',
      'bank_slip': 'Boleto Bancário'
    };
    return names[method] || 'Cartão de Crédito';
  }

  // Obtém descrição do método de pagamento
  getPaymentMethodDescription(method: string): string {
    const descriptions: {[key: string]: string} = {
      'credit_card': 'Pagamento instantâneo em até 12x',
      'pix': 'Pagamento instantâneo via chave PIX',
      'bank_slip': 'Pagamento em até 2 dias úteis'
    };
    return descriptions[method] || 'Pagamento instantâneo';
  }

  // Compartilha a doação (simulação)
  shareDonation(): void {
    const shareText = `Acabei de doar R$${this.donation.valor} para a campanha "${this.campaignTitle}"!`;
    if (navigator.share) {
      navigator.share({
        title: 'Fiz uma doação!',
        text: shareText,
        url: window.location.href
      }).catch(err => {
        console.log('Erro ao compartilhar:', err);
        this.copyToClipboard(shareText);
      });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  // Copia texto para área de transferência
  private copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Texto copiado para a área de transferência!');
  }
}
