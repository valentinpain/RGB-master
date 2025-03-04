let targetColor;

function randomRGB() {
  return Math.floor(Math.random() * 256);
}

function newGame() {
  document.getElementById("submit_button").style.display = "inline";
  document.getElementById("guessColor").style.display = "none";
  targetColor = { r: randomRGB(), g: randomRGB(), b: randomRGB() };
  document.getElementById(
    "targetColor"
  ).style.backgroundColor = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;

  document.getElementById("guessColor").style.backgroundColor = "white";

  document.getElementById("result").textContent = "";
  document.getElementById("r").value = "";
  document.getElementById("g").value = "";
  document.getElementById("b").value = "";
  // document.querySelectorAll("input").forEach((input) => (input.value = ""));
}

function checkGuess() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Veuillez entrer un nom d'utilisateur avant de valider !");
    return;
  }

  const r = parseInt(document.getElementById("r").value) || 0;
  const g = parseInt(document.getElementById("g").value) || 0;
  const b = parseInt(document.getElementById("b").value) || 0;

  const error =
    Math.abs(r - targetColor.r) +
    Math.abs(g - targetColor.g) +
    Math.abs(b - targetColor.b);

  const score = Math.max(0, 100 - (error / 7.65).toFixed(2));

  document.getElementById("result").textContent = `Score : ${score.toFixed(
    2
  )}% - Réponse : RGB(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;

  fetch("/submit-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, score: score.toFixed(2) }),
  }).then(() => updateLeaderboard());
}

function updateLeaderboard() {
  fetch("/leaderboard")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("leaderboard-list");
      list.innerHTML = "";
      data.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}%`;
        list.appendChild(li);
      });
    });
}

newGame();
updateLeaderboard();
