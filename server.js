const express = require("express");
const cors = require("cors");

const tribeLicenses = require("./data/licenses");
const getPlayerTribe = require("./services/getPlayerTribe");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API rodando com sucesso"
  });
});

app.post("/validate-access", async (req, res) => {
  try {
    const { playerName, world } = req.body || {};

    if (!playerName || !world) {
      return res.status(400).json({
        authorized: false,
        message: "playerName e world são obrigatórios"
      });
    }

    const playerTribe = await getPlayerTribe(playerName, world);

    if (!playerTribe) {
      return res.json({
        authorized: false,
        message: "Não foi possível identificar a tribo do jogador"
      });
    }

    const license = tribeLicenses.find(
      (item) =>
        item.world.toLowerCase() === String(world).toLowerCase() &&
        item.tribeTag.toLowerCase() === String(playerTribe.tribeTag).toLowerCase()
    );

    if (!license) {
      return res.json({
        authorized: false,
        message: "Tribo não autorizada"
      });
    }

    if (!license.active) {
      return res.json({
        authorized: false,
        message: "Licença da tribo está desativada"
      });
    }

    if (license.expiresAt && new Date(license.expiresAt).getTime() < Date.now()) {
      return res.json({
        authorized: false,
        message: "Licença expirada"
      });
    }

    return res.json({
      authorized: true,
      playerName,
      world,
      tribeTag: license.tribeTag,
      tribeName: license.tribeName,
      expiresAt: license.expiresAt,
      cacheTtlHours: 12
    });
  } catch (error) {
    console.error("Erro em /validate-access:", error);

    return res.status(500).json({
      authorized: false,
      message: "Erro interno"
    });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});