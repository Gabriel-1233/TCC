export interface Ong {
  _id: string;
  nome: string;
  descricao: string;
  cnpj: string;
  logo?: string;
  site?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  areasAtuacao: string[];
  selos: {
    nome: string;
    descricao: string;
    dataConquista: Date;
  }[];
  avaliacaoMedia?: number;
  avaliacaoCount?: number;
  usuario: string;
}
