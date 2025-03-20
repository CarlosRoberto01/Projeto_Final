const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verificarToken = require("./authMiddleware");

const express = require("express"); // Importa o express
const app = express(); //instancia o express

const { PrismaClient } = require("@prisma/client"); //DIFERENTE
const prisma = new PrismaClient(); //DIFERENTE

const cors = require("cors"); //DIFERENTE
app.use(cors()); // DIFERENTE (Libera o acesso do frontend, VAMOS VER MAIS NA FRENTE)

const PORT = 3000; //Aqui eu defino a porta
app.use(express.json()); // Permite que a API receba JSON


// teste servidor
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Rota para listar todos os gastos
app.get("/gastos", verificarToken , async (req, res) => {
  try {
    const gastos = await prisma.gasto.findMany({ where: { usuarioId: req.usuarioId } });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar gastos" });
  }
});

// Rota para cadastro de usuário
app.post("/cadastro" , async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaCriptografada },
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

// Rota de login para gerar JWT
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: usuario.id }, "seu_segredo_super_secreto", { expiresIn: "1h" });

    res.json({ message: "Login realizado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

// Rota para buscar um gasto por ID
app.get("/gastos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gasto = await prisma.gasto.findUnique({ where: { id } });

    if (!gasto) {
      return res.status(404).json({ error: "Gasto não encontrado" });
    }

    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar gasto" });
  }
});

// Rota para adicionar um novo gasto
app.post("/gastos", verificarToken , async (req, res) => {
  try {
    const { descricao, valor, categoria, data } = req.body;
    const novoGasto = await prisma.gasto.create({
      data: { descricao, valor: parseFloat(valor), categoria, data: new Date(data), usuarioId: req.usuarioId},
    });
    res.status(201).json(novoGasto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar gasto" });
  }
});

// Rota para excluir um gasto por ID
app.delete("/gastos/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const gastoExiste = await prisma.gasto.findUnique({ where: { id } });
  
      if (!gastoExiste) {
        return res.status(404).json({ error: "Gasto não encontrado" });
      }
  
      await prisma.gasto.delete({ where: { id } });
  
      res.json({ message: "Gasto excluído com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir gasto" });
    }
  });
  
// Rota para atualizar um gasto por ID
  app.put("/gastos/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body;

        if (!body.nome || !body.preco || !body.quantidade || !body.categoria) {
            return res.status(400).json({
                message: "Todos os campos obrigatórios devem ser preenchidos."
            });
        }

        const atualizaGasto = await prisma.gasto.update({ data: body, where: { id } })

        res.status(200).json({ messsage: "Gasto atualizado com sucesso" })

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o Gasto" });

    }

})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});