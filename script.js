// ---------------- AUDIO ---------------- //
const tickAudio = new Audio("assets/tick.mp3");
tickAudio.loop = true;

const clickAudio = new Audio("assets/click.mp3");     // you add your own file
const failAudio = new Audio("assets/fail.mp3");       // optional, soft error sound
const explodeAudio = new Audio("assets/explode.mp3"); // cake detonation sound
const victoryAudio = new Audio("assets/victory.mp3"); // valorant victory sound

// Force tick to start as soon as ANY user gesture happens
document.addEventListener("click", () => {
    if (tickAudio.paused) {
        tickAudio.play().catch(() => {});
    }
    startRoundTimer();
}, { once: true });


// ---------------- ELEMENTS ---------------- //
const btn = document.getElementById("defuse-btn");
const statusLine = document.getElementById("status-line");
const progressBar = document.getElementById("progress-bar");
const timerLabel = document.getElementById("timer-label");

// ---------------- CONSTANTS ---------------- //
const DEFUSE_TIME = 7000; // 7 seconds
const ROUND_TIMER = 40000; // 40 seconds

// ---------------- STATE ---------------- //
let holdTime = 0;
let holding = false;
let defuseInterval = null;
let roundInterval = null;
let roundTimeLeft = ROUND_TIMER;
let finished = false;

// ---------------- ROUND TIMER ---------------- //
function startRoundTimer() {
  roundInterval = setInterval(() => {
    roundTimeLeft -= 1000;
    updateRoundTimer();

    if (roundTimeLeft <= 0) {
      triggerDetonation();
    }
  }, 1000);
}

function updateRoundTimer() {
  const sec = Math.floor(roundTimeLeft / 1000);
  timerLabel.textContent = `00.00 / 07.00  |  Round Ends: ${sec}s`;
}

// ---------------- DEFUSE LOGIC ---------------- //
function updateDefuseUI() {
  const ratio = Math.min(holdTime / DEFUSE_TIME, 1);
  progressBar.style.width = ratio * 100 + "%";

  const elapsed = (holdTime / 1000).toFixed(2).padStart(5, "0");
  timerLabel.textContent = `${elapsed} / 07.00  |  Round Ends: ${Math.floor(roundTimeLeft/1000)}s`;
}

function startHold(e) {
  e.preventDefault();

  clickAudio.currentTime = 0; // restart click
  clickAudio.play().catch(() => {});

  if (finished || holding) return;

  holding = true;
  statusLine.textContent = "Defusing… do NOT let go.";
  
  defuseInterval = setInterval(() => {
    holdTime += 50;
    updateDefuseUI();

    if (holdTime >= DEFUSE_TIME) {
      clearInterval(defuseInterval);
      holding = false;
      finished = true;

      triggerSuccess();
    }
  }, 50);
}

function endHold() {
  if (!holding || finished) return;

  clearInterval(defuseInterval);
  holding = false;
  holdTime = 0;
  progressBar.style.width = "0%";

  failAudio.play().catch(()=>{});
  statusLine.textContent = "You let go too early… try again.";
}

// ---------------- SUCCESS ---------------- //
function triggerSuccess() {
  tickAudio.pause();
  victoryAudio.play().catch(()=>{});

  statusLine.textContent = "CLUTCH! Cake defused.";
  statusLine.style.color = "#b7ffb7";

  // Confetti burst
  const duration = 1800;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 10,
      startVelocity: 25,
      spread: 60,
      origin: { x: Math.random(), y: 0.6 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  // zoom-out + redirect
  setTimeout(() => {
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "main.html";
    }, 800);
  }, 5000);
}

// ---------------- DETONATION ---------------- //
function triggerDetonation() {
  clearInterval(roundInterval);
  clearInterval(defuseInterval);

  holding = false;
  holdTime = 0;
  progressBar.style.width = "0%";

  tickAudio.pause();
  explodeAudio.play().catch(()=>{});

  statusLine.textContent = "The cake has detonated! Resetting…";
  statusLine.style.color = "#ff8080";

  // Cake explosion animation (CSS class)
  document.querySelector(".cake-outer").classList.add("explode");

  setTimeout(() => {
    document.querySelector(".cake-outer").classList.remove("explode");
    resetRound();
  }, 1600);
}

// ---------------- RESET ROUND ---------------- //
function resetRound() {
  roundTimeLeft = ROUND_TIMER;
  holdTime = 0;
  finished = false;

  statusLine.style.color = "#ffccd5";
  statusLine.textContent = "Round reset. Hold to defuse.";

  updateRoundTimer();
  tickAudio.currentTime = 0;
  tickAudio.play().catch(()=>{});
  
  startRoundTimer();
}

// ---------------- EVENT HANDLERS ---------------- //
btn.addEventListener("mousedown", startHold);
btn.addEventListener("touchstart", startHold, { passive:false });

window.addEventListener("mouseup", endHold);
window.addEventListener("touchend", endHold);

// ---------------- INIT ---------------- //
updateRoundTimer();
