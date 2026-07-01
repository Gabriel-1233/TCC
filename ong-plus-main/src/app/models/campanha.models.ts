export interface ModelCampanha {
  _id: string;
  titulo: string;
  descricao: string;
  ong: {
    _id: string;
    nome: string;
    logo?: string;
  };
  categoria: 'alimentos' | 'roupas' | 'dinheiro' | 'sangue' | 'brinquedos' | 'outros';
  meta: number;
  arrecadado: number;
  dataInicio: Date;
  dataFim: Date;
  status: 'ativa' | 'encerrada' | 'suspensa';
  imagem: string[];
  local: {
    endereco: string;
    cidade: string;
    estado: string;
  };
  avaliacaoMedia?: number;
  avaliacaoCount?: number;
}
