import { useEffect, useState } from "react";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then(setLeaderboard);
  }, []);

  const submitScore = async () => {
    if (!username) return alert("Veuillez entrer un nom d'utilisateur !");
    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, score }),
    });
    setLeaderboard((prev) => [...prev, { name: username, score }]);
  };

  return (
    <div>
      <h1>🎯 Jeu de Devine la Couleur</h1>

      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={submitScore}>Enregistrer mon score</button>

      <h2>🏆 Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, i) => (
          <li key={i}>
            {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
