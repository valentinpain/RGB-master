const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const leaderboardFile = "leaderboard.txt";

// Lire le leaderboard
app.get("/leaderboard", (req, res) => {
  fs.readFile(leaderboardFile, "utf8", (err, data) => {
    if (err) return res.json([]);
    const scores = data
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [name, score] = line.split(": ");
        return { name, score: parseFloat(score) };
      })
      .sort((a, b) => b.score - a.score); // Trier du plus grand au plus petit
    res.json(scores);
  });
});

// Ajouter un score seulement si le username est renseigné
app.post("/submit-score", (req, res) => {
  const { name, score } = req.body;
  if (!name || name.trim() === "") {
    return res.status(400).send("Nom d'utilisateur requis");
  }
  const entry = `${name}: ${score}\n`;
  fs.appendFile(leaderboardFile, entry, (err) => {
    if (err) return res.status(500).send("Erreur d'écriture");
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
