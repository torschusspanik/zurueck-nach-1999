(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const screens = ["start-screen", "instructions-screen", "game-screen", "gameover-screen", "victory-screen"];
  const player = $("player");
  const world = $("game-world");
  const objectsLayer = $("objects-layer");
  const scoreEl = $("score");
  const elapsedEl = $("elapsed");
  const finalScoreEl = $("final-score");
  const bgAudio = $("background-audio");
  const chorusAudio = $("chorus-audio");
  const teleportAudio = $("teleport-audio");
  let endingTimer = 0;

  // Replace these files in assets/ with your own MP3 files, keeping the same names.
  const state = {
    running: false, score: 0, elapsed: 0, playerX: 0.5,
    moveLeft: false, moveRight: false, objects: [],
    lastTime: 0, spawnTimer: 0, animationId: 0, clockTimer: 0,
    difficulty: 0, bgStarted: false
  };

  function showScreen(id) {
    screens.forEach(screenId => $(screenId).classList.toggle("active", screenId === id));
  }

  async function startBackgroundMusic() {
    chorusAudio.pause();
    chorusAudio.currentTime = 0;
    bgAudio.volume = 0.45;
    try {
      await bgAudio.play();
      state.bgStarted = true;
    } catch (err) {
      // Some browsers require another user gesture. The next button press will retry.
      $("music-status").textContent = "Falls kein Ton zu hören ist, prüfe bitte die Audio-Datei.";
    }
  }

  $("cover-ok").addEventListener("click", async () => {
    showScreen("instructions-screen");
    await startBackgroundMusic();
  });

  $("start-game").addEventListener("click", async () => {
    if (!state.bgStarted) await startBackgroundMusic();
    beginGame();
  });

  $("restart-game").addEventListener("click", async () => {
    await startBackgroundMusic();
    beginGame();
  });
  $("restart-after-victory").addEventListener("click", async () => {
    teleportAudio.pause();
    teleportAudio.currentTime = 0;
    await startBackgroundMusic();
    beginGame();
  });

  function beginGame() {
    cancelAnimationFrame(state.animationId);
    clearInterval(state.clockTimer);
    clearTimeout(endingTimer);
    chorusAudio.pause(); chorusAudio.currentTime = 0;
    teleportAudio.pause(); teleportAudio.currentTime = 0;
    $("teleport-success").hidden = false;
    $("teleport-failure").hidden = true;
    state.running = true;
    state.score = 0;
    state.elapsed = 0;
    state.playerX = 0.5;
    state.moveLeft = false;
    state.moveRight = false;
    state.objects.forEach(obj => obj.el.remove());
    state.objects = [];
    state.spawnTimer = 0;
    state.difficulty = 0;
    state.lastTime = 0;
    scoreEl.textContent = "0";
    elapsedEl.textContent = "0";
    player.style.left = "50%";
    showScreen("game-screen");
    // Make the world size available before the first animation frame.
    state.animationId = requestAnimationFrame(loop);
    state.clockTimer = setInterval(() => {
      if (!state.running) return;
      state.elapsed++;
      elapsedEl.textContent = String(state.elapsed);
    }, 1000);
  }

  function createObject() {
    const isL = Math.random() < Math.min(0.27 + state.elapsed * 0.008, 0.68);
    const el = document.createElement("div");
    el.className = "falling-object " + (isL ? "l-object" : "cd-object");
    if (isL) el.textContent = "L";
    const worldWidth = world.clientWidth;
    const x = 18 + Math.random() * Math.max(1, worldWidth - 54);
    el.style.left = `${x}px`;
    objectsLayer.appendChild(el);
    state.objects.push({ el, x, y: -44, type: isL ? "L" : "CD", size: isL ? 32 : 34 });
  }

  function intersects(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function playEndingAudio(audio, statusElement, missingMessage) {
    chorusAudio.pause(); chorusAudio.currentTime = 0;
    teleportAudio.pause(); teleportAudio.currentTime = 0;
    bgAudio.pause(); bgAudio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(() => { statusElement.textContent = missingMessage; });
  }

  function endGame() {
    if (!state.running) return;
    state.running = false;
    cancelAnimationFrame(state.animationId);
    clearInterval(state.clockTimer);
    state.moveLeft = state.moveRight = false;
    finalScoreEl.textContent = String(state.score);
    showScreen("gameover-screen");
    const status = $("music-status");
    status.textContent = "Der Refrain läuft …";
    playEndingAudio(chorusAudio, status, "Lege chorus.mp3 in den assets-Ordner und starte erneut.");
  }

  function winGame() {
    if (!state.running) return;
    state.running = false;
    cancelAnimationFrame(state.animationId);
    clearInterval(state.clockTimer);
    state.moveLeft = state.moveRight = false;
    showScreen("victory-screen");
    $("teleport-success").hidden = false;
    $("teleport-failure").hidden = true;
    $("victory-title").textContent = "ZEITREISE.EXE";
    $("spotify-victory").hidden = true;
    $("restart-after-victory").hidden = true;
    // The apparent victory lasts briefly, then the teleportation fails.
    endingTimer = setTimeout(() => {
      $("teleport-success").hidden = true;
      $("teleport-failure").hidden = false;
      $("victory-title").textContent = "KRITISCHER FEHLER";
      $("spotify-victory").hidden = false;
      $("restart-after-victory").hidden = false;
      const status = $("teleport-music-status");
      status.textContent = "Der Zeitreise-Soundtrack läuft …";
      playEndingAudio(teleportAudio, status, "Lege es-gibt-kein-zurueck.mp3 in den assets-Ordner.");
    }, 5000);
  }

  chorusAudio.addEventListener("ended", () => {
    $("music-status").textContent = "Noch eine Runde?";
  });
  teleportAudio.addEventListener("ended", () => {
    $("teleport-music-status").textContent = "Es gibt kein Zurück! Oder doch?";
  });
  teleportAudio.addEventListener("error", () => {
    $("teleport-music-status").textContent = "Audio fehlt: Bitte assets/es-gibt-kein-zurueck.mp3 hinzufügen.";
  });
  chorusAudio.addEventListener("error", () => {
    $("music-status").textContent = "Audio fehlt: Bitte assets/chorus.mp3 ersetzen.";
  });
  bgAudio.addEventListener("error", () => {
    $("music-status").textContent = "Audio fehlt: Bitte assets/background-music.mp3 ersetzen.";
  });

  function loop(timestamp) {
    if (!state.running) return;
    if (!state.lastTime) state.lastTime = timestamp;
    const dt = Math.min((timestamp - state.lastTime) / 1000, 0.04);
    state.lastTime = timestamp;
    const worldWidth = world.clientWidth;
    const worldHeight = world.clientHeight;

    state.difficulty = Math.min(state.elapsed / 48, 1);
    const speed = 245 + Math.min(state.elapsed * 4.4, 230);
    if (state.moveLeft) state.playerX -= (speed / worldWidth) * dt;
    if (state.moveRight) state.playerX += (speed / worldWidth) * dt;
    state.playerX = Math.max(0.035, Math.min(0.965, state.playerX));
    player.style.left = `${state.playerX * 100}%`;

    state.spawnTimer += dt;
    const spawnInterval = Math.max(0.23, 0.78 - state.elapsed * 0.009);
    if (state.spawnTimer >= spawnInterval) {
      state.spawnTimer = 0;
      createObject();
      if (state.elapsed > 12 && Math.random() < Math.min((state.elapsed - 10) / 75, 0.48)) createObject();
    }

    const playerRect = player.getBoundingClientRect();
    const playerBox = {
      left: playerRect.left + playerRect.width * 0.22,
      right: playerRect.right - playerRect.width * 0.22,
      top: playerRect.top + playerRect.height * 0.18,
      bottom: playerRect.bottom - playerRect.height * 0.05
    };

    for (let i = state.objects.length - 1; i >= 0; i--) {
      const obj = state.objects[i];
      obj.y += (150 + Math.min(state.elapsed * 5.0, 230)) * dt;
      obj.el.style.top = `${obj.y}px`;
      const rect = obj.el.getBoundingClientRect();
      if (intersects(playerBox, { left: rect.left + 4, right: rect.right - 4, top: rect.top + 3, bottom: rect.bottom - 3 })) {
        if (obj.type === "L") {
          endGame();
          return;
        } else {
          state.score++;
          scoreEl.textContent = String(state.score);
          obj.el.remove();
          state.objects.splice(i, 1);
          if (state.score >= 99) { winGame(); return; }
          continue;
        }
      }
      if (obj.y > worldHeight + 50) {
        obj.el.remove();
        state.objects.splice(i, 1);
      }
    }

    state.animationId = requestAnimationFrame(loop);
  }

  function setMove(direction, value, button) {
    if (direction === "left") state.moveLeft = value;
    if (direction === "right") state.moveRight = value;
    button.classList.toggle("pressed", value);
  }

  function bindTouchButton(id, direction) {
    const button = $(id);
    const down = (event) => { event.preventDefault(); setMove(direction, true, button); };
    const up = (event) => { event.preventDefault(); setMove(direction, false, button); };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointercancel", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("contextmenu", event => event.preventDefault());
  }
  bindTouchButton("left-control", "left");
  bindTouchButton("right-control", "right");

  window.addEventListener("keydown", event => {
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowLeft") state.moveLeft = true;
    if (event.key === "ArrowRight") state.moveRight = true;
  }, { passive: false });
  window.addEventListener("keyup", event => {
    if (event.key === "ArrowLeft") state.moveLeft = false;
    if (event.key === "ArrowRight") state.moveRight = false;
  });
  window.addEventListener("blur", () => {
    state.moveLeft = state.moveRight = false;
    $("left-control").classList.remove("pressed");
    $("right-control").classList.remove("pressed");
  });
})();
