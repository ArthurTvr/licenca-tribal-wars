const express = require("express");
const cors = require("cors");
const tribeLicenses = require("./data/licenses");

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
    const { world, tribeId, tribeTag, tribeName, playerName } = req.body || {};

    if (!world || !tribeId) {
      return res.status(400).json({
        authorized: false,
        message: "world e tribeId são obrigatórios"
      });
    }

    const license = tribeLicenses.find(
      (item) =>
        item.world.toLowerCase() === String(world).toLowerCase() &&
        String(item.tribeId) === String(tribeId)
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
      playerName: playerName || "",
      world,
      tribeId: license.tribeId,
      tribeTag: license.tribeTag || tribeTag || "",
      tribeName: license.tribeName || tribeName || "",
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