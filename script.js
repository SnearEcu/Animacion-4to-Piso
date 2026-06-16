const characterSelect = document.querySelector("#characterSelect");
const scenarioSelect = document.querySelector("#scenarioSelect");
const characters = document.querySelectorAll(".character");
const band = document.querySelector("#band");
const backgroundTrack = document.querySelector(".background-track");
const backgroundMusic = document.querySelector("#backgroundMusic");
const loadingScreen = document.querySelector("#loadingScreen");
const loadingButton = document.querySelector("#loadingButton");
const loadingMeter = document.querySelector("#loadingMeter");
const missingAsset = document.querySelector("#missingAsset");
const scoreValue = document.querySelector("#scoreValue");
const comboValue = document.querySelector("#comboValue");
const energyValue = document.querySelector("#energyValue");
const cueCard = document.querySelector("#cueCard");
const cueKicker = document.querySelector("#cueKicker");
const cueText = document.querySelector("#cueText");
const cueMeter = document.querySelector("#cueMeter");
const noteLane = document.querySelector("#noteLane");
const startGameButton = document.querySelector("#startGameButton");
const runButton = document.querySelector("#runButton");

const requiredImages = [
  "assets/backgrounds/fondo-loop-1.png",
  "assets/backgrounds/fondo-loop-2.png",
  "assets/backgrounds/fondo-loop-3.png",
  "assets/backgrounds/fondo-loop-4.png",
  "assets/backgrounds/fondo-2-loop-1.png",
  "assets/backgrounds/fondo-2-loop-2.png",
  "assets/backgrounds/fondo-2-loop-3.png",
  "assets/backgrounds/fondo-2-loop-4.png",
  "assets/backgrounds/fondo-3-loop-1.png",
  "assets/backgrounds/fondo-3-loop-2.png",
  "assets/backgrounds/fondo-3-loop-3.png",
  "assets/backgrounds/fondo-3-loop-4.png",
  "assets/backgrounds/fondo-4-loop-1.png",
  "assets/backgrounds/fondo-4-loop-2.png",
  "assets/backgrounds/fondo-4-loop-3.png",
  "assets/backgrounds/fondo-4-loop-4.png",
  "assets/backgrounds/transition-seam-1-to-2.png",
  "assets/backgrounds/transition-seam-2-to-3.png",
  "assets/backgrounds/transition-seam-3-to-4.png",
  "assets/backgrounds/transition-seam-4-to-1.png",
  "assets/ui/loading-stage.png",
  "assets/video-run/guitarist-1.png",
  "assets/video-run/singer-fixed.png",
  "assets/video-run/drummer-fixed.png",
  "assets/video-run/guitarist-2.png",
  "assets/video-run/bassist-fixed.png",
  "assets/video-run/band.png"
];

const scenarios = {
  continuous: [
    "assets/backgrounds/fondo-loop-1.png",
    "assets/backgrounds/fondo-loop-2.png",
    "assets/backgrounds/fondo-loop-3.png",
    "assets/backgrounds/fondo-loop-4.png",
    "assets/backgrounds/transition-seam-1-to-2.png",
    "assets/backgrounds/fondo-2-loop-1.png",
    "assets/backgrounds/fondo-2-loop-2.png",
    "assets/backgrounds/fondo-2-loop-3.png",
    "assets/backgrounds/fondo-2-loop-4.png",
    "assets/backgrounds/transition-seam-2-to-3.png",
    "assets/backgrounds/fondo-3-loop-1.png",
    "assets/backgrounds/fondo-3-loop-2.png",
    "assets/backgrounds/fondo-3-loop-3.png",
    "assets/backgrounds/fondo-3-loop-4.png",
    "assets/backgrounds/transition-seam-3-to-4.png",
    "assets/backgrounds/fondo-4-loop-1.png",
    "assets/backgrounds/fondo-4-loop-2.png",
    "assets/backgrounds/fondo-4-loop-3.png",
    "assets/backgrounds/fondo-4-loop-4.png",
    "assets/backgrounds/transition-seam-4-to-1.png"
  ],
  main: [
    "assets/backgrounds/fondo-loop-1.png",
    "assets/backgrounds/fondo-loop-2.png",
    "assets/backgrounds/fondo-loop-3.png",
    "assets/backgrounds/fondo-loop-4.png"
  ],
  sunset: [
    "assets/backgrounds/fondo-2-loop-1.png",
    "assets/backgrounds/fondo-2-loop-2.png",
    "assets/backgrounds/fondo-2-loop-3.png",
    "assets/backgrounds/fondo-2-loop-4.png"
  ],
  flowerPark: [
    "assets/backgrounds/fondo-3-loop-1.png",
    "assets/backgrounds/fondo-3-loop-2.png",
    "assets/backgrounds/fondo-3-loop-3.png",
    "assets/backgrounds/fondo-3-loop-4.png"
  ],
  walkwayPark: [
    "assets/backgrounds/fondo-4-loop-1.png",
    "assets/backgrounds/fondo-4-loop-2.png",
    "assets/backgrounds/fondo-4-loop-3.png",
    "assets/backgrounds/fondo-4-loop-4.png"
  ]
};

const game = {
  active: false,
  score: 0,
  combo: 0,
  energy: 74,
  beat: 0,
  cueTimer: null,
  missTimer: null,
  activeNote: null
};

function applyScenario(name) {
  const frames = scenarios[name] || scenarios.continuous;
  const loopFrames = [...frames, ...frames];
  const baseFrameCount = scenarios.main.length;
  const baseDuration = 25;

  document.documentElement.style.setProperty(
    "--bg-duration",
    `${baseDuration * (frames.length / baseFrameCount)}s`
  );

  backgroundTrack.replaceChildren(
    ...loopFrames.map((src) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = "";
      return image;
    })
  );
}

function applyCharacterSelection() {
  const selected = characterSelect.value;
  const isFullBand = selected === "all";

  band.classList.toggle("is-full-band-running", isFullBand);

  characters.forEach((character) => {
    const isVisible = selected === "all" || character.dataset.character === selected;
    character.hidden = !isVisible;
    character.classList.toggle("is-running", isVisible);
  });
}

function preloadImages() {
  let loaded = 0;

  return Promise.all(
    requiredImages.map((src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        loaded += 1;
        loadingMeter.style.width = `${Math.round((loaded / requiredImages.length) * 78)}%`;
        resolve();
      };
      image.onerror = () => reject(new Error(src));
      image.src = src;
    }))
  );
}

function preloadMusic() {
  if (backgroundMusic.readyState >= 3) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const done = () => resolve();

    backgroundMusic.addEventListener("canplaythrough", done, { once: true });
    backgroundMusic.addEventListener("canplay", done, { once: true });
    backgroundMusic.load();
    window.setTimeout(done, 4500);
  });
}

function setLoadingReady() {
  loadingMeter.style.width = "100%";
  loadingButton.disabled = false;
  loadingButton.textContent = "Entrar";
  loadingScreen.classList.add("is-ready");
}

function hideLoadingScreen() {
  loadingScreen.classList.add("is-leaving");
  document.body.classList.remove("is-loading");

  window.setTimeout(() => {
    loadingScreen.hidden = true;
  }, 620);
}

function updateHud() {
  scoreValue.textContent = game.score.toString();
  comboValue.textContent = `${game.combo}x`;
  energyValue.style.width = `${Math.max(0, Math.min(100, game.energy))}%`;
}

function setCue(kicker, text, danger = false) {
  cueKicker.textContent = kicker;
  cueText.textContent = text;
  cueCard.classList.toggle("is-danger", danger);
  cueMeter.classList.remove("is-counting");
  void cueMeter.offsetWidth;
  cueMeter.classList.add("is-counting");
}

function clearGameTimers() {
  window.clearTimeout(game.cueTimer);
  window.clearTimeout(game.missTimer);
}

function removeActiveNote(missed = false) {
  if (!game.activeNote) {
    return;
  }

  game.activeNote.classList.toggle("is-miss", missed);
  game.activeNote.addEventListener("animationend", () => game.activeNote?.remove(), { once: true });
  window.setTimeout(() => {
    game.activeNote?.remove();
    game.activeNote = null;
  }, 280);
}

function spawnNote() {
  const note = document.createElement("span");
  note.className = "note-token bolt";
  note.textContent = "3";
  noteLane.replaceChildren(note);
  game.activeNote = note;
}

function endGame(message = "Ensayo terminado") {
  game.active = false;
  clearGameTimers();
  removeActiveNote();
  runButton.disabled = true;
  startGameButton.textContent = "Reiniciar";
  setCue("Resultado", `${message}: ${game.score} pts`, game.energy <= 0);
}

function missBeat() {
  if (!game.active || !game.activeNote) {
    return;
  }

  game.combo = 0;
  game.energy -= 18;
  removeActiveNote(true);
  updateHud();

  if (game.energy <= 0) {
    endGame("Sin energia");
    return;
  }

  setCue("Tarde", "Recupera el ritmo", true);
}

function scheduleBeat() {
  if (!game.active) {
    return;
  }

  game.beat += 1;

  if (game.beat > 12) {
    endGame("Buen ensayo");
    return;
  }

  spawnNote();
  setCue(`Compas ${game.beat}/12`, "Correr", game.energy < 35);

  game.missTimer = window.setTimeout(missBeat, 1450);
  game.cueTimer = window.setTimeout(scheduleBeat, 1900);
}

function startGame() {
  clearGameTimers();
  noteLane.replaceChildren();

  game.active = true;
  game.score = 0;
  game.combo = 0;
  game.energy = 74;
  game.beat = 0;
  game.activeNote = null;

  runButton.disabled = false;
  startGameButton.textContent = "Reiniciar";
  updateHud();
  setCue("Listos", "Sigue el pulso");
  game.cueTimer = window.setTimeout(scheduleBeat, 520);
}

function hitRun() {
  if (!game.active || !game.activeNote) {
    return;
  }

  window.clearTimeout(game.missTimer);
  game.combo += 1;
  game.energy = Math.min(100, game.energy + 7);
  game.score += 100 + (game.combo * 12);
  game.activeNote.classList.add("is-hit");

  const feedback = document.createElement("span");
  feedback.className = "hit-feedback";
  feedback.textContent = `+${100 + (game.combo * 12)}`;
  game.activeNote.append(feedback);

  window.setTimeout(() => removeActiveNote(), 180);
  updateHud();
  setCue("Bien", `Combo ${game.combo}x`, false);
}

scenarioSelect.addEventListener("change", () => {
  applyScenario(scenarioSelect.value);
});

characterSelect.addEventListener("change", applyCharacterSelection);
startGameButton.addEventListener("click", startGame);
runButton.addEventListener("click", hitRun);

async function startBackgroundMusic() {
  if (loadingButton.disabled) {
    return;
  }

  try {
    await backgroundMusic.play();
    hideLoadingScreen();
  } catch {
    loadingButton.textContent = "Toca para entrar";
  }
}

loadingButton.addEventListener("click", startBackgroundMusic);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && loadingScreen.hidden) {
    startGame();
    return;
  }

  if (event.key === "3") {
    hitRun();
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    startBackgroundMusic();
  }
});

document.body.classList.add("is-running-scene");
applyScenario(scenarioSelect.value);
applyCharacterSelection();
updateHud();

Promise.all([preloadImages(), preloadMusic()])
  .then(setLoadingReady)
  .catch((error) => {
    if (missingAsset) {
      document.body.classList.add("asset-missing");
      missingAsset.textContent = `No se pudo precargar: ${error.message || "un recurso"}.`;
    }

    loadingButton.disabled = false;
    loadingButton.textContent = "Entrar";
  });
