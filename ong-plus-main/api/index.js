const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const pastaUploads = path.join(__dirname, "uploads");

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(pastaUploads));


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

function addAtividade(atividade) {

  const atividades = getAtividades();

  atividades.unshift({
    _id: uuidv4(),
    ...atividade,
    data: new Date()
  });

  const ultimas = atividades
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 10);

  salvarArquivo("atividades.json", ultimas);

}

const storage = multer.diskStorage({

  destination(req, file, cb) {
    cb(null, pastaUploads);
  },

  filename(req, file, cb) {

    const extensao = path.extname(file.originalname);

    cb(null, req.params.id + extensao);

  }

});

const upload = multer({
  storage
});

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

  const usuarios = getUsuarios();

  const index = usuarios.findIndex(
    u => u._id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Usuário não encontrado"
    });
  }

  console.log("===== DADOS RECEBIDOS =====");
console.log(req.body);

usuarios[index] = {
  ...usuarios[index],
  ...req.body
};

console.log("===== USUÁRIO SALVO =====");
console.log(usuarios[index]);

  salvarArquivo("usuarios.json", usuarios);

  res.json(usuarios[index]);
});

app.post(
  "/usuarios/:id/photo",
  upload.single("photo"),
  (req, res) => {

    const usuarios = getUsuarios();

    const usuario = usuarios.find(
      u => u._id === req.params.id
    );

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      });
    }

    usuario.fotoPerfil = `/uploads/${req.file.filename}`;

    salvarArquivo("usuarios.json", usuarios);

    res.json({
      url: usuario.fotoPerfil
    });

  }
);


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

  const campanhas = getCampanhas();

  try {

    console.log(req.body);

    const campanhas = getCampanhas();
    

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
        nome: req.body.ong?.nome || "ONG Anônima",
        logo: req.body.ong?.logo || ""
      }
    };

    campanhas.push(novaCampanha);

    salvarArquivo("campanhas.json", campanhas);

    addAtividade({

  tipo: "campanha",

  usuarioId: novaCampanha.ong?._id,

  nome: novaCampanha.ong?.nome,

  fotoPerfil: novaCampanha.ong?.logo || "",

  campanha: novaCampanha.titulo,

  data: new Date()

});

    res.status(201).json(novaCampanha);

  } catch(err) {
    console.error(err);
    res.status(500).json(err);
  }

});

app.put("/api/campanhas/:id", (req, res) => {

  const campanhas = getCampanhas();

  const index = campanhas.findIndex(
    c => c._id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Campanha não encontrada"
    });
  }

  campanhas[index] = {
    ...campanhas[index],
    ...req.body
  };

  salvarArquivo("campanhas.json", campanhas);

  res.json(campanhas[index]);

});
app.delete("/api/campanhas/:id", (req, res) => {

  let campanhas = getCampanhas();

  campanhas = campanhas.filter(
    c => c._id !== req.params.id
  );

  salvarArquivo("campanhas.json", campanhas);

  res.status(204).send();

});

// ========================
// ROTAS DE DOAÇÕES (futuro)
// ========================
app.get("/api/donations", (req,res)=>{
    res.json(getDoacoes());
});

app.get("/api/donations/monthly/:email", (req, res) => {

  const email = req.params.email;

  const usuarios = getUsuarios();
  const campanhas = getCampanhas();
  const doacoes = getDoacoes();

  console.log("================================");
console.log("Email recebido:", email);
console.log("Usuários cadastrados:");
console.log(usuarios);
console.log("================================");

  const usuario = usuarios.find(
    u => u.email === email
  );

  if (!usuario) {
    return res.status(404).json({
      message: "ONG não encontrada"
    });
  }

  // campanhas da ONG
  const idsCampanhas = campanhas
    .filter(c => c.ong && c.ong._id === usuario._id)
    .map(c => c._id);

  const meses = [
    0,0,0,0,0,0,0,0,0,0,0,0
  ];

  doacoes.forEach(d => {

    const campanhaId =
      typeof d.campanha === "string"
        ? d.campanha
        : d.campanha._id;

    if (!idsCampanhas.includes(campanhaId))
      return;

    const data = new Date(d.data);

    meses[data.getMonth()] += Number(d.valor);

  });

  res.json(meses);

});

app.get("/api/dashboard-ong/:email", (req, res) => {

  const email = req.params.email;

  const usuarios = getUsuarios();
  const campanhas = getCampanhas();
  const doacoes = getDoacoes();

  // procura a ONG
  const usuario = usuarios.find(
    u => u.email === email
  );

  if (!usuario) {
    return res.status(404).json({
      message: "ONG não encontrada"
    });
  }

  // campanhas da ONG
  const campanhasDaOng = campanhas.filter(
    c => c.ong && c.ong._id === usuario._id
  );

  const campanhasAtivas = campanhasDaOng.length;

  // total arrecadado
  const totalDoacoes = campanhasDaOng.reduce(
    (soma, campanha) => soma + Number(campanha.arrecadado || 0),
    0
  );

  // ids das campanhas
  const idsCampanhas = campanhasDaOng.map(c => c._id);

  // somente doações dessas campanhas
  const doacoesDaOng = doacoes.filter(d => {

    const campanhaId =
      typeof d.campanha === "string"
        ? d.campanha
        : d.campanha?._id;

    return idsCampanhas.includes(campanhaId);

  });

  // conta doadores únicos
  const doadoresUnicos = new Set();

  doacoesDaOng.forEach(d => {

    const id =
      d.donorId ||
      d.usuarioId ||
      d.email;

    if (id) {
      doadoresUnicos.add(id);
    }

  });

  res.json({

    campaigns: campanhasAtivas,

    donations: totalDoacoes,

    donors: doadoresUnicos.size,

    volunteers: 0,

    mission: "Impactando vidas",

    monthlyGoal: 75

  });

});

app.get("/api/dashboard-ong/:email/monthly", (req, res) => {

  const email = req.params.email;

  const usuarios = getUsuarios();
  const campanhas = getCampanhas();
  const doacoes = getDoacoes();

  const usuario = usuarios.find(
    u => u.email === email
  );

  if (!usuario) {
    return res.status(404).json([]);
  }

  const campanhasIds = campanhas
    .filter(c => c.ong._id === usuario._id)
    .map(c => c._id);

  const meses = {};

  doacoes.forEach(d => {

    const campanhaId =
      typeof d.campanha === "string"
        ? d.campanha
        : d.campanha._id;

    if (!campanhasIds.includes(campanhaId))
      return;

    const data = new Date(d.data);

    const chave =
      `${data.getMonth()+1}/${data.getFullYear()}`;

    meses[chave] =
      (meses[chave] || 0) + Number(d.valor);

  });

  const resultado = Object.keys(meses).map(m => ({
      month: m,
      value: meses[m]
  }));

  res.json(resultado);

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

  const usuarios = getUsuarios();

const usuario = usuarios.find(
  u =>
    u._id === req.body.usuarioId ||
    u.email === req.body.email
);

  const  donorId =
  req.body.usuarioId ||
  req.body.email ||
  req.body.donorId ||
  uuidv4();


  console.log("BODY RECEBIDO:");
console.log(req.body);
const novaDoacao = {
  _id: uuidv4(),

  usuarioId: req.body.usuarioId || null,
  donorId: req.body.donorId || req.body.sessionId || uuidv4(),

  nome:
    req.body.doador?.nome ||
    req.body.nome ||
    "Anônimo",

  fotoPerfil:
    req.body.doador?.fotoPerfil ||
    req.body.fotoPerfil ||
    "",

  email: req.body.email || null,

  campanha: req.body.campanha,

  valor: Number(req.body.valor),

  anonima: req.body.anonima || false,

  data: new Date()
};

  let doacoes = getDoacoes();
doacoes.push(novaDoacao);
salvarArquivo("doacoes.json", doacoes);

addAtividade({
  tipo: "doacao",
  usuarioId: novaDoacao.usuarioId,
  nome: novaDoacao.anonima ? "Anônimo" : novaDoacao.nome,
  fotoPerfil: novaDoacao.anonima ? "" : novaDoacao.fotoPerfil,
  valor: novaDoacao.valor,
  campanha:
    typeof novaDoacao.campanha === "string"
      ? ""
      : novaDoacao.campanha.titulo,
  data: new Date()
});

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
