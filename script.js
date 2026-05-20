const characterSelect = document.querySelector("#characterSelect");
const scenarioSelect = document.querySelector("#scenarioSelect");
const characters = document.querySelectorAll(".character");
const backgroundTrack = document.querySelector(".background-track");

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

  characters.forEach((character) => {
    const isVisible = selected === "all" || character.dataset.character === selected;
    character.hidden = !isVisible;
    character.classList.toggle("is-running", isVisible);
  });
}

function preloadImages() {
  return Promise.all(
    requiredImages.map((src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
    }))
  );
}

scenarioSelect.addEventListener("change", () => {
  applyScenario(scenarioSelect.value);
});

characterSelect.addEventListener("change", applyCharacterSelection);

document.body.classList.add("is-running-scene");
applyScenario(scenarioSelect.value);
applyCharacterSelection();

preloadImages().catch(() => {
  document.body.classList.add("asset-missing");
});
