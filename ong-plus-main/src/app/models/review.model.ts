export interface Review {
  _id: string;
  usuario: {
    _id: string;
    nome: string;
    fotoPerfil?: string;
  };
  tipo: 'ong' | 'campanha';
  alvo: string;
  nota: number;
  comentario?: string;
  dataCriacao: Date;
}
