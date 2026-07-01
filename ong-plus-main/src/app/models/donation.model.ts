export interface Donation {
  _id?: string;
  doador: {
    _id: string;
    nome: string;
    fotoPerfil?: string;
  };
  campanha: {
    _id: string;
    titulo: string;
    imagem?: string;
  };
  valor: number;
  mensagem?: string;
  anonima: boolean;
  comprovante?: string;
  dataDoacao: Date;
  status?: string;
  metodoPagamento?: string;
}