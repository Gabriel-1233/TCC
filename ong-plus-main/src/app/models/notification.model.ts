export interface Notification {
  _id: string;
  usuario: string;
  tipo: 'doacao' | 'voluntariado' | 'campanha' | 'sistema';
  titulo: string;
  mensagem: string;
  lida: boolean;
  metadata?: {
    campanha?: string;
    doacao?: string;
    voluntariado?: string;
  };
  dataCriacao: Date;
}
