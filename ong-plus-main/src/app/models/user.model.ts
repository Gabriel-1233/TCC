export interface User {
  _id: string;
  nome: string;
  email: string;
  tipo: 'doador' | 'ong';
  fotoPerfil?: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCriacao: Date;
}

export interface OngUser extends User {
  cnpj: string;
  descricao: string;
  areasAtuacao: string[];
  site?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  selos: {
    tipo: string;
    dataConquista: Date;
  }[];
}
