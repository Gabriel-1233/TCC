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
function getUsuarios() {
  return lerArquivo("usuarios.json");
}

function getCampanhas() {
  return lerArquivo("campanhas.json");
}

function getDoacoes() {
  return lerArquivo("doacoes.json");
}

function getAtividades() {
  return lerArquivo("atividades.json");
}

function addAtividade(texto) {
  const atividades = getAtividades();

  atividades.unshift({
    _id: uuidv4(),
    texto,
    data: new Date()
  });

  salvarArquivo("atividades.json", atividades);
}

// ========================
// ROTAS DE AUTENTICAÇÃO
// ========================
app.post("/register", (req, res) => {

  const { email } = req.body;

  const usuarios = getUsuarios();
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

  const usuarios = getUsuarios();
  const usuario = usuarios.find(
    u => u.email === email && u.senha === senha
  );

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

  const usuarios = getUsuarios();
const campanhas = getCampanhas();
  const usuario = usuarios.find(
    u => u._id === req.params.id
  );

  if (!usuario) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  res.json(usuario);
});

app.get("/api/atividades", (req, res) => {
  res.json(getAtividades());
});

app.put("/usuarios/:id", (req, res) => {
  const index = usuarios.findIndex(u => u._id === req.params.id);
  const campanhas = getCampanhas();
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
  res.json(getCampanhas());
});

app.get("/api/campanhas/:id", (req, res) => {

  const campanhas = getCampanhas();

  const campanha = campanhas.find(
    c => c._id === req.params.id
  );

  if (!campanha) {
    return res.status(404).json({ message: "Campanha não encontrada" });
  }

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
    imagem: req.body.imagem ? [req.body.imagem] : [],
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

app.get("/api/donations/monthly", (req, res) => {

  const doacoes = getDoacoes();
const campanhas = getCampanhas();
  const meses = {};

  doacoes.forEach(d => {
    const data = new Date(d.data);
    const mes = data.getMonth(); // 0-11

    meses[mes] = (meses[mes] || 0) + Number(d.valor);
  });

  const resultado = Object.keys(meses).map(m => ({
    month: m,
    value: meses[m]
  }));

  res.json(resultado);
});

app.get("/api/dashboard-ong/:email", (req, res) => {

  const email = req.params.email;
const campanhas = getCampanhas();
  const usuarios = getUsuarios();

  const usuario = usuarios.find(
    u => u.email === email
  );

  if (!usuario) {
    return res.status(404).json({
      message: "ONG não encontrada"
    });
  }


  const campanhasDaOng = campanhas.filter(
    c => c.ong && c.ong._id === usuario._id
  );

  const campanhasAtivas = campanhasDaOng.length;

  const totalDoacoes = campanhasDaOng.reduce(
    (soma, campanha) => soma + campanha.arrecadado,
    0
  );

  res.json({
    campaigns: campanhasAtivas,
    donations: totalDoacoes,
    volunteers: 0,
    mission: "Impactando vidas",
    monthlyGoal: 75
  });

});

app.get("/api/dashboard-donors/:email", (req, res) => {

  const doacoes = getDoacoes();

  const usuariosUnicos = new Set(
    doacoes
      .map(d => d.donorId) // 🔥 AGORA SEMPRE EXISTE
      .filter(Boolean)
  );

  res.json({
    donors: usuariosUnicos.size
  });

});

app.post("/api/donations", (req, res) => {
  
  console.log("========== NOVA DOAÇÃO ==========");
  console.log(req.body);

  const donorId =
  req.body.usuarioId ||
  req.body.email ||
  req.body.donorId ||
  uuidv4();

  const novaDoacao = {
  _id: uuidv4(),

  usuarioId: req.body.usuarioId || null,
  email: req.body.email || null,

  // 🔥 ISSO É O MAIS IMPORTANTE
  donorId: req.body.donorId || req.body.sessionId || uuidv4(),

  campanha: req.body.campanha,
  valor: Number(req.body.valor),

  anonima: req.body.anonima || false,

  data: new Date()
};

  let doacoes = getDoacoes();
doacoes.push(novaDoacao);
salvarArquivo("doacoes.json", doacoes);

let campanhas = getCampanhas();
const campanhaId =
  typeof novaDoacao.campanha === "string"
    ? novaDoacao.campanha
    : novaDoacao.campanha._id;

const campanha = campanhas.find(c => c._id === campanhaId);

console.log("Campanha encontrada:");
console.log(campanha);

if (campanha) {

  console.log("Tipo do arrecadado:", typeof campanha.arrecadado);
  console.log("Valor antes:", campanha.arrecadado);

  campanha.arrecadado =
  Number(campanha.arrecadado || 0) + Number(novaDoacao.valor || 0);

  console.log("Valor depois:", campanha.arrecadado);

  salvarArquivo("campanhas.json", campanhas);

} else {

  console.log("❌ Campanha NÃO encontrada");

}

  res.status(201).json(novaDoacao);

});

// ========================
// INICIAR SERVIDOR
// ========================
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/`);
});
