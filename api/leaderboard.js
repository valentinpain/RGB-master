import { put, get } from "@vercel/blob";

const BLOB_URL = "leaderboard.json"; // Nom du fichier dans le blob storage

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const blob = await get(BLOB_URL);
      const data = blob ? await (await fetch(blob.url)).json() : [];
      res.status(200).json(data.sort((a, b) => b.score - a.score));
    } catch (error) {
      res.status(500).json({ error: "Erreur de récupération des scores" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, score } = req.body;
      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Nom d'utilisateur requis" });
      }

      // Récupérer les scores actuels
      const blob = await get(BLOB_URL);
      let scores = blob ? await (await fetch(blob.url)).json() : [];

      // Ajouter le nouveau score
      scores.push({ name, score });

      // Sauvegarder dans le Blob Storage
      await put(BLOB_URL, JSON.stringify(scores), { access: "public" });

      res.status(200).json({ success: true, leaderboard: scores });
    } catch (error) {
      res.status(500).json({ error: "Erreur d'écriture" });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
