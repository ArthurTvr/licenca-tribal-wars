async function getPlayerTribe(playerName, world) {
  const fakeMap = {
    "br101:Arthur": { tribeTag: "OSBRABOS", tribeName: "Os Brabos" },
    "br101:Bruno": { tribeTag: "OSBRABOS", tribeName: "Os Brabos" },
    "br101:Carlos": { tribeTag: "ALPHA", tribeName: "Alpha Team" },
    "br101:Diego": { tribeTag: "SEMTRIBO", tribeName: "Sem Tribo" }
  };

  return fakeMap[`${world}:${playerName}`] || null;
}

module.exports = getPlayerTribe;