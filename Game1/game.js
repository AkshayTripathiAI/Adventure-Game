// Bheem Ladoo Dash - hold to run, dodge the bouncing Kirmadas, reach the ladoo.
// Vanilla JS + canvas, no build step.
(function () {
  "use strict";

  // ---- Logical game size (canvas is scaled to fit the screen) ----
  var W = 700;
  var H = 400;
  var BEST_KEY = "bheemLadooDash.best";
  var MUTE_KEY = "bheemLadooDash.muted";

  var canvas = document.getElementById("mycanvas");
  var pen = canvas.getContext("2d");
  var $ = function (id) { return document.getElementById(id); };

  // ---- Images ----
  function loadImage(src) {
    var img = new Image();
    img.src = src;
    return img;
  }
  var images = {
    enemy: loadImage("images/kirmada.png"),
    player: loadImage("images/bheem.png"),
    ladoo: loadImage("images/ladoo.jpg"),
    bg: loadImage("images/milky-way-2695569__480.jpg")
  };
  function ready(img) { return img.complete && img.naturalWidth > 0; }

  // ---- Storage helpers (localStorage can throw in private mode) ----
  function readStore(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  // ---- Tiny synth sounds (no audio files, nothing plays before a user gesture) ----
  var audioCtx = null;
  var muted = readStore(MUTE_KEY, "0") === "1";
  function unlockAudio() {
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }
  function beep(freq, duration, type, slideTo) {
    if (muted || !audioCtx) return;
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }
  var sfx = {
    hit: function () { beep(220, 0.25, "sawtooth", 80); },
    win: function () { beep(523, 0.12); setTimeout(function () { beep(659, 0.12); }, 110); setTimeout(function () { beep(784, 0.25); }, 220); },
    over: function () { beep(330, 0.3, "triangle", 110); setTimeout(function () { beep(165, 0.5, "triangle", 60); }, 280); },
    step: function () { beep(880, 0.04, "sine"); }
  };

  // ---- Game state ----
  var state = "menu"; // menu | playing | paused | levelclear | over
  var best = parseInt(readStore(BEST_KEY, "0"), 10) || 0;
  var score, level, lives, levelTime, invuln, player, ladoo, enemies, floaters;
  var input = { forward: false, back: false, pointer: false };
  var shake = 0;

  function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    setupLevel();
  }

  function setupLevel() {
    levelTime = 0;
    invuln = 0;
    floaters = [];
    player = { x: 20, y: H / 2 - 30, w: 60, h: 60, speed: 200 };
    ladoo = { x: W - 90, y: H / 2 - 30, w: 60, h: 60, bob: 0 };

    // Difficulty ramp: more enemies and faster bouncing each level.
    var count = Math.min(3 + Math.floor((level - 1) / 2), 7);
    var speed = 170 + (level - 1) * 30;
    enemies = [];
    var left = 130;
    var right = W - 170;
    for (var i = 0; i < count; i++) {
      var x = count === 1 ? (left + right) / 2 : left + (right - left) * (i / (count - 1));
      var dir = Math.random() < 0.5 ? 1 : -1;
      enemies.push({
        x: x,
        y: 20 + Math.random() * (H - 100),
        w: 56,
        h: 56,
        vy: dir * speed * (0.8 + Math.random() * 0.4)
      });
    }
  }

  // Slightly shrunk hit boxes so near-misses feel fair.
  function isOverlap(a, b) {
    var pad = 8;
    return a.x + pad < b.x + b.w - pad &&
      a.x + a.w - pad > b.x + pad &&
      a.y + pad < b.y + b.h - pad &&
      a.y + a.h - pad > b.y + pad;
  }

  function addFloater(text, x, y, color) {
    floaters.push({ text: text, x: x, y: y, life: 1, color: color || "#fff" });
  }

  // ---- Update (dt in seconds, frame-rate independent) ----
  function update(dt) {
    levelTime += dt;
    if (invuln > 0) invuln -= dt;

    var moving = input.forward || input.pointer;
    if (moving) player.x += player.speed * dt;
    if (input.back) player.x -= player.speed * dt;
    player.x = Math.max(0, Math.min(W - player.w, player.x));

    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      e.y += e.vy * dt;
      if (e.y <= 0) { e.y = 0; e.vy = Math.abs(e.vy); }
      if (e.y >= H - e.h) { e.y = H - e.h; e.vy = -Math.abs(e.vy); }

      if (invuln <= 0 && isOverlap(e, player)) {
        lives--;
        invuln = 1.5;
        sfx.hit();
        shake = 0.3;
        addFloater("-1 ❤", player.x + 10, player.y, "#ff6b6b");
        player.x = Math.max(0, player.x - 70); // knock back
        if (lives <= 0) { endGame(); return; }
      }
    }

    ladoo.bob += dt * 4;

    if (isOverlap(player, ladoo)) {
      var bonus = Math.max(0, Math.round((12 - levelTime) * 15));
      var gained = 100 * level + bonus;
      score += gained;
      sfx.win();
      $("levelTitle").textContent = "Level " + level + " clear!";
      $("levelInfo").textContent = "+" + gained + " (speed bonus " + bonus + ")  •  Score " + score;
      level++;
      state = "levelclear";
      show("levelScreen");
    }

    for (var f = floaters.length - 1; f >= 0; f--) {
      floaters[f].life -= dt;
      floaters[f].y -= 30 * dt;
      if (floaters[f].life <= 0) floaters.splice(f, 1);
    }
    if (shake > 0) shake -= dt;
  }

  // ---- Drawing ----
  function drawBackground() {
    if (ready(images.bg)) {
      var img = images.bg;
      var scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      var w = img.naturalWidth * scale;
      var h = img.naturalHeight * scale;
      pen.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    } else {
      pen.fillStyle = "#0b0b1e";
      pen.fillRect(0, 0, W, H);
    }
    // Finish zone glow behind the ladoo
    var grad = pen.createLinearGradient(W - 140, 0, W, 0);
    grad.addColorStop(0, "rgba(255,200,50,0)");
    grad.addColorStop(1, "rgba(255,200,50,0.25)");
    pen.fillStyle = grad;
    pen.fillRect(W - 140, 0, 140, H);
  }

  function drawSprite(img, o, fallback) {
    if (ready(img)) pen.drawImage(img, o.x, o.y, o.w, o.h);
    else { pen.fillStyle = fallback; pen.fillRect(o.x, o.y, o.w, o.h); }
  }

  function draw() {
    pen.save();
    if (shake > 0) pen.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    drawBackground();

    // Ladoo bobs gently
    var lad = { x: ladoo.x, y: ladoo.y + Math.sin(ladoo.bob) * 6, w: ladoo.w, h: ladoo.h };
    pen.save();
    pen.beginPath();
    pen.arc(lad.x + lad.w / 2, lad.y + lad.h / 2, lad.w / 2, 0, Math.PI * 2);
    pen.clip();
    drawSprite(images.ladoo, lad, "#f5a623");
    pen.restore();

    for (var i = 0; i < enemies.length; i++) drawSprite(images.enemy, enemies[i], "#c0392b");

    // Blink while invulnerable
    if (!(invuln > 0 && Math.floor(invuln * 10) % 2 === 0)) drawSprite(images.player, player, "#f39c12");

    for (var f = 0; f < floaters.length; f++) {
      var fl = floaters[f];
      pen.globalAlpha = Math.max(0, fl.life);
      pen.fillStyle = fl.color;
      pen.font = "bold 18px Trebuchet MS, Arial";
      pen.fillText(fl.text, fl.x, fl.y);
      pen.globalAlpha = 1;
    }
    pen.restore();

    drawHud();
  }

  function drawHud() {
    pen.fillStyle = "rgba(0,0,0,0.45)";
    pen.fillRect(0, 0, W, 30);
    pen.fillStyle = "#fff";
    pen.font = "bold 16px Trebuchet MS, Arial";
    pen.textBaseline = "middle";
    pen.textAlign = "left";
    pen.fillText("Score " + score, 10, 15);
    pen.fillText("Level " + level, 150, 15);
    pen.fillStyle = "#ff6b6b";
    pen.fillText("❤".repeat(Math.max(0, lives)) + "♡".repeat(Math.max(0, 3 - lives)), 260, 15);
    pen.fillStyle = "#ffcc33";
    pen.textAlign = "right";
    pen.fillText("Best " + Math.max(best, score), W - 10, 15);
    pen.textAlign = "left";
    pen.textBaseline = "alphabetic";
  }

  // ---- Screens ----
  var screens = ["startScreen", "pauseScreen", "levelScreen", "overScreen"];
  function show(id) {
    screens.forEach(function (s) { $(s).hidden = s !== id; });
  }

  function startGame() {
    unlockAudio();
    resetGame();
    state = "playing";
    show(null);
  }

  function nextLevel() {
    if (state !== "levelclear") return;
    setupLevel();
    state = "playing";
    show(null);
  }

  function endGame() {
    state = "over";
    sfx.over();
    var isBest = score > best;
    if (isBest) { best = score; writeStore(BEST_KEY, String(best)); }
    $("overInfo").textContent = "Score " + score + "  •  Reached level " + level + (isBest ? "  •  New best!" : "  •  Best " + best);
    $("bestStart").textContent = best;
    show("overScreen");
  }

  function togglePause() {
    if (state === "playing") { state = "paused"; show("pauseScreen"); }
    else if (state === "paused") { state = "playing"; show(null); last = performance.now(); }
  }

  function toggleMute() {
    muted = !muted;
    writeStore(MUTE_KEY, muted ? "1" : "0");
    $("muteBtn").innerHTML = muted ? "&#128263;" : "&#128266;";
  }

  // ---- Input ----
  var FORWARD = { ArrowRight: 1, d: 1, D: 1, " ": 1 };
  var BACK = { ArrowLeft: 1, a: 1, A: 1 };
  document.addEventListener("keydown", function (e) {
    if (FORWARD[e.key] || BACK[e.key] || e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
    if (FORWARD[e.key]) input.forward = true;
    if (BACK[e.key]) input.back = true;
    if (e.key === "p" || e.key === "P" || e.key === "Escape") togglePause();
    if (e.key === "m" || e.key === "M") toggleMute();
    if (e.key === "Enter") {
      if (state === "menu" || state === "over") startGame();
      else if (state === "levelclear") nextLevel();
      else if (state === "paused") togglePause();
    }
    if ((e.key === "r" || e.key === "R") && state !== "menu") startGame();
  });
  document.addEventListener("keyup", function (e) {
    if (FORWARD[e.key]) input.forward = false;
    if (BACK[e.key]) input.back = false;
  });
  window.addEventListener("blur", function () {
    input.forward = input.back = input.pointer = false;
    if (state === "playing") togglePause();
  });

  canvas.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    unlockAudio();
    input.pointer = true;
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (type) {
    canvas.addEventListener(type, function () { input.pointer = false; });
  });
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  $("startBtn").addEventListener("click", startGame);
  $("restartBtn1").addEventListener("click", startGame);
  $("restartBtn2").addEventListener("click", startGame);
  $("resumeBtn").addEventListener("click", togglePause);
  $("nextBtn").addEventListener("click", nextLevel);
  $("pauseBtn").addEventListener("click", function () { this.blur(); togglePause(); });
  $("muteBtn").addEventListener("click", function () { this.blur(); unlockAudio(); toggleMute(); });

  // ---- Crisp canvas on high-DPI screens ----
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    var scale = Math.max(1, (rect.width / W) * dpr);
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    pen.setTransform(scale, 0, 0, scale, 0, 0);
  }
  window.addEventListener("resize", resize);

  // ---- Main loop: requestAnimationFrame + delta time ----
  var last = performance.now();
  function loop(now) {
    var dt = Math.min((now - last) / 1000, 0.05); // clamp after tab switches
    last = now;
    if (state === "playing") update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  $("bestStart").textContent = best;
  $("muteBtn").innerHTML = muted ? "&#128263;" : "&#128266;";
  resetGame();
  resize();
  requestAnimationFrame(loop);
})();
