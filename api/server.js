const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  const leaderboardFile = path.join(process.cwd(), "/leaderboard.txt");

  if (req.method === "GET") {
    // Lire le leaderboard
    fs.readFile(leaderboardFile, "utf8", (err, data) => {
      if (err) {console.log('wtf'); return res.status(500).json({ error: "Erreur de lecture" });}
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
  } else if (req.method === "POST") {
    // Ajouter un score si le username est renseigné
    const { name, score } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nom d'utilisateur requis" });
    }
    const entry = `${name}: ${score}\n`;
    fs.appendFile(leaderboardFile, entry, (err) => {
      if (err) return res.status(500).json({ error: "Erreur d'écriture" });
      res.status(200).json({ success: true });
    });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
