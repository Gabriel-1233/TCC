const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Funções utilitárias para lidar com arquivos
function lerArquivo(nomeArquivo) {
  const caminho = path.join(DATA_DIR, nomeArquivo);
  if (!fs.existsSync(caminho)) return [];
  return JSON.parse(fs.readFileSync(caminho, "utf-8"));
}

function salvarArquivo(nomeArquivo, dados) {
  const caminho = path.join(DATA_DIR, nomeArquivo);
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
}

// Carrega os dados salvos
let usuarios = lerArquivo("usuarios.json");
let campanhas = lerArquivo("campanhas.json");
let doacoes = lerArquivo("doacoes.json");

// ========================
// ROTAS DE AUTENTICAÇÃO
// ========================
app.post("/register", (req, res) => {
  const { email } = req.body;

  if (usuarios.find(u => u.email === email)) {
    return res.status(409).json({ message: "Usuário já existe" });
  }

  const novoUsuario = {
    _id: uuidv4(),
    ...req.body,
    dataCriacao: new Date()
  };

  usuarios.push(novoUsuario);
  salvarArquivo("usuarios.json", usuarios);

  res.status(201).json({ user: novoUsuario, token: "fake-token" });
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
  res.status(200).json({ user: usuario, token: "fake-token" });
});

// ===================
// ROTAS DE USUARIOS
// ===================
// ========================
// ROTAS DE USUÁRIOS
// ========================
app.get("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find(u => u._id === req.params.id);
  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  res.json(usuario);
});

app.put("/usuarios/:id", (req, res) => {
  const index = usuarios.findIndex(u => u._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  usuarios[index] = { ...usuarios[index], ...req.body };
  salvarArquivo("usuarios.json", usuarios);
  res.json(usuarios[index]);
});


// ========================
// ROTAS DE CAMPANHAS
// ========================
app.get("/api/campanhas", (req, res) => {
  res.json(campanhas);
});

app.get("/api/campanhas/:id", (req, res) => {
  const campanha = campanhas.find(c => c._id === req.params.id);
  if (!campanha) return res.status(404).json({ message: "Campanha não encontrada" });
  res.json(campanha);
});

app.post("/api/campanhas", (req, res) => {
  const novaCampanha = {
    _id: uuidv4(),
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    categoria: req.body.categoria,
    meta: parseFloat(req.body.meta),
    arrecadado: 0,
    avaliacaoCount: 0,
    avaliacaoMedia: 0,
    status: "ativa",
    imagem: [],
    dataInicio: new Date(),
    dataFim: new Date(req.body.dataFim),
    local: req.body.local,
    ong: {
      _id: req.body.ong?._id || uuidv4(),
      nome: req.body.ong?.nome || 'ONG Anônima',
      logo: req.body.ong?.logo || ''
    }
  };

  campanhas.push(novaCampanha);
  salvarArquivo("campanhas.json", campanhas);
  res.status(201).json(novaCampanha);
});

app.put("/api/campanhas/:id", (req, res) => {
  const index = campanhas.findIndex(c => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Campanha não encontrada" });
  campanhas[index] = { ...campanhas[index], ...req.body };
  salvarArquivo("campanhas.json", campanhas);
  res.json(campanhas[index]);
});

app.delete("/api/campanhas/:id", (req, res) => {
  campanhas = campanhas.filter(c => c._id !== req.params.id);
  salvarArquivo("campanhas.json", campanhas);
  res.status(204).send();
});

// ========================
// ROTAS DE DOAÇÕES (futuro)
// ========================
app.get("/api/donations", (req, res) => {
  res.json(doacoes);
});

// ========================
// INICIAR SERVIDOR
// ========================
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/`);
});
