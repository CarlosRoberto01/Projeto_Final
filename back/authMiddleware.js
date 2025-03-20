const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado! Nenhum token fornecido." });
  }

  try {
    const tokenLimpo = token.replace("Bearer ", ""); // Remove o prefixo 'Bearer '
    const decoded = jwt.verify(tokenLimpo, "seu_segredo_super_secreto");
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = verificarToken;
