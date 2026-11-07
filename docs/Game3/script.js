// Chota Bheem Adventures - jump over the charging bull.
// DOM sprites moved with requestAnimationFrame + delta time (frame-rate independent).
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var ASSETS = document.body.getAttribute("data-assets") || "";
  var BEST_KEY = "chotaBheemAdventures.best";
  var MUTE_KEY = "chotaBheemAdventures.muted";

  function readStore(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  var bheemEl = $("bheem");
  var bullEl = $("bull");
  var messageEl = $("message");

  // Audio objects are created up front but only played after a click / key press
  var music = new Audio(ASSETS + "Chota Bheem - BGM.mp3");
  music.loop = true;
  music.volume = 0.6;
  var overSound = new Audio(ASSETS + "gameover.mp3");
  var muted = readStore(MUTE_KEY, "0") === "1";
  function play(audio, restart) {
    if (muted) return;
    try {
      if (restart) audio.currentTime = 0;
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* ignore */ }
  }

  // ---- State ----
  var state = "menu"; // menu | playing | paused | over
  var best = parseInt(readStore(BEST_KEY, "0"), 10) || 0;
  var W, H, scale;
  var bheem = { x: 0, y: 0, vy: 0, w: 140, h: 130 };
  var bull = { x: 0, w: 160, h: 150, speed: 0, wait: 0, scored: false };
  var score = 0;
  var keys = { left: false, right: false };
  var messageTimer = 0;

  function measure() {
    W = window.innerWidth;
    H = window.innerHeight;
    scale = Math.max(0.55, Math.min(1.2, H / 650));
    bheem.w = 140 * scale; bheem.h = 130 * scale;
    bull.w = 160 * scale; bull.h = 150 * scale;
    bheemEl.style.width = bheem.w + "px"; bheemEl.style.height = bheem.h + "px";
    bullEl.style.width = bull.w + "px"; bullEl.style.height = bull.h + "px";
    bheem.x = Math.max(0, Math.min(W - bheem.w, bheem.x));
  }

  // Jump physics: peak height scales with the screen, the jump always lasts ~0.95 s
  function jumpPeak() { return Math.min(H * 0.55, 420 * scale + 60); }
  var JUMP_TIME = 0.95;
  function gravity() { return 8 * jumpPeak() / (JUMP_TIME * JUMP_TIME); }
  function jumpVelocity() { return 4 * jumpPeak() / JUMP_TIME; }

  // Bull crosses the screen in ~4 s at the start, but never so slowly that it cannot be jumped
  function baseSpeed() { return Math.max(W * 1.1 / 4.2, 330 * scale); }

  function resetGame() {
    measure();
    score = 0;
    bheem.x = 52 * scale;
    bheem.y = 0;
    bheem.vy = 0;
    bull.speed = baseSpeed();
    bull.x = W + 40;
    bull.wait = 0.6;
    bull.scored = false;
    bheemEl.classList.remove("hurt");
    updateScore();
    showMessage("Jump over the bull!", 2);
  }

  function updateScore() {
    $("score").textContent = score;
    $("best").textContent = Math.max(best, score);
  }

  function showMessage(text, seconds) {
    messageEl.textContent = text;
    messageEl.style.opacity = 1;
    messageTimer = seconds;
  }

  function jump() {
    if (state !== "playing") return;
    if (bheem.y <= 0.5) bheem.vy = jumpVelocity();
  }

  // ---- Update ----
  function update(dt) {
    // Horizontal movement
    var moveSpeed = 420 * scale;
    if (keys.left) bheem.x -= moveSpeed * dt;
    if (keys.right) bheem.x += moveSpeed * dt;
    bheem.x = Math.max(0, Math.min(W - bheem.w, bheem.x));

    // Vertical movement
    if (bheem.y > 0 || bheem.vy > 0) {
      bheem.vy -= gravity() * dt;
      bheem.y += bheem.vy * dt;
      if (bheem.y <= 0) { bheem.y = 0; bheem.vy = 0; }
    }

    // Bull
    if (bull.wait > 0) {
      bull.wait -= dt;
    } else {
      bull.x -= bull.speed * dt;
      if (!bull.scored && bull.x + bull.w < bheem.x) {
        bull.scored = true;
        score++;
        updateScore();
        bull.speed = Math.min(bull.speed * 1.06, baseSpeed() * 3.2); // difficulty ramp
        if (score % 5 === 0) showMessage(score + " dodges! Faster now!", 1.4);
      }
      if (bull.x < -bull.w) {
        bull.x = W + 20;
        bull.scored = false;
        bull.wait = 0.25 + Math.random() * Math.max(0.3, 1.4 - score * 0.05); // random gap
      }
    }

    // Collision with forgiving hit boxes
    var bx = bheem.x + bheem.w * 0.25, bw = bheem.w * 0.5;
    var ox = bull.x + bull.w * 0.2, ow = bull.w * 0.6;
    var bullTop = bull.h * 0.6;
    if (bx < ox + ow && bx + bw > ox && bheem.y < bullTop) {
      gameOver();
    }

    if (messageTimer > 0) {
      messageTimer -= dt;
      if (messageTimer <= 0) messageEl.style.opacity = 0;
    }
  }

  function render() {
    bheemEl.style.transform = "translate(" + bheem.x + "px," + (-bheem.y) + "px)";
    bullEl.style.transform = "translate(" + bull.x + "px,0)";
  }

  // ---- Screens ----
  function show(id) {
    ["startPage", "pauseScreen", "overScreen"].forEach(function (s) { $(s).hidden = s !== id; });
  }

  function startGame() {
    $("gamePage").hidden = false;
    resetGame();
    state = "playing";
    show(null);
    render();
    last = performance.now();
    play(music, true);
  }

  function togglePause() {
    if (state === "playing") { state = "paused"; music.pause(); show("pauseScreen"); }
    else if (state === "paused") { state = "playing"; show(null); last = performance.now(); play(music); }
  }

  function gameOver() {
    state = "over";
    bheemEl.classList.add("hurt");
    music.pause();
    play(overSound, true);
    var isBest = score > best;
    if (isBest) { best = score; writeStore(BEST_KEY, String(best)); }
    $("overTitle").textContent = isBest && score > 0 ? "New High Score!" : "Game Over";
    $("punchGif").hidden = !(isBest && score > 0);
    $("overInfo").textContent = "You dodged the bull " + score + (score === 1 ? " time" : " times") + ". Best: " + best;
    $("bestStart").textContent = best;
    updateScore();
    setTimeout(function () { if (state === "over") show("overScreen"); }, 500);
  }

  function setMuted(value) {
    muted = value;
    writeStore(MUTE_KEY, muted ? "1" : "0");
    $("muteBtn").innerHTML = muted ? "&#128263;" : "&#128266;";
    if (muted) music.pause();
    else if (state === "playing") play(music);
  }

  // ---- Input ----
  document.addEventListener("keydown", function (e) {
    var k = e.key;
    if (k === "ArrowUp" || k === " " || k === "ArrowDown" || k === "ArrowLeft" || k === "ArrowRight") e.preventDefault();
    if (k === "ArrowUp" || k === " " || k === "w" || k === "W") jump();
    if (k === "ArrowLeft" || k === "a" || k === "A") keys.left = true;
    if (k === "ArrowRight" || k === "d" || k === "D") keys.right = true;
    if (k === "p" || k === "P" || k === "Escape") togglePause();
    if (k === "m" || k === "M") setMuted(!muted);
    if (k === "Enter") {
      if (state === "paused") togglePause();
      else if (state !== "playing") startGame();
    }
    if ((k === "r" || k === "R") && state !== "menu") startGame();
  });
  document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
  });
  window.addEventListener("blur", function () {
    keys.left = keys.right = false;
    if (state === "playing") togglePause();
  });

  // Tap anywhere on the game to jump; on-screen buttons on touch devices
  $("gameContainer").addEventListener("pointerdown", function (e) {
    if (e.target.closest("button")) return;
    jump();
  });
  function holdButton(id, key) {
    var el = $(id);
    el.addEventListener("pointerdown", function (e) { e.preventDefault(); keys[key] = true; });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) {
      el.addEventListener(t, function () { keys[key] = false; });
    });
  }
  holdButton("leftBtn", "left");
  holdButton("rightBtn", "right");
  $("jumpBtn").addEventListener("pointerdown", function (e) { e.preventDefault(); jump(); });

  $("startButton").addEventListener("click", startGame);
  $("restartButton").addEventListener("click", startGame);
  $("restartButton1").addEventListener("click", startGame);
  $("resumeButton").addEventListener("click", togglePause);
  $("pauseBtn").addEventListener("click", function () { this.blur(); togglePause(); });
  $("muteBtn").addEventListener("click", function () { this.blur(); setMuted(!muted); });
  window.addEventListener("resize", function () { measure(); render(); });

  // ---- Main loop ----
  var last = performance.now();
  function loop(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (state === "playing") { update(dt); render(); }
    requestAnimationFrame(loop);
  }

  $("bestStart").textContent = best;
  $("muteBtn").innerHTML = muted ? "&#128263;" : "&#128266;";
  measure();
  requestAnimationFrame(loop);
});
