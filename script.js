// Hearts canvas animation
(function heartsAnimation() {
  const canvas = document.getElementById("heartsCanvas");
  const ctx = canvas.getContext("2d");
  let hearts = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.clientWidth = canvas.parentElement.clientWidth;
    height = canvas.clientHeight = canvas.parentElement.clientHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function createHeart() {
    const size = Math.random() * 6 + 6;
    return {
      x: Math.random() * width,
      y: height + size,
      size,
      speed: Math.random() * 0.6 + 0.25,
      alpha: Math.random() * 0.5 + 0.4,
      drift: Math.random() * 0.6 - 0.3,
    };
  }

  function drawHeart(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ff6b9a";
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    if (hearts.length < 80 && Math.random() > 0.6) {
      hearts.push(createHeart());
    }
    hearts.forEach((h) => {
      h.y -= h.speed;
      h.x += h.drift;
      h.alpha -= 0.0015;
    });
    hearts = hearts.filter((h) => h.y + h.size > -10 && h.alpha > 0);
    hearts.forEach((h) => drawHeart(h.x, h.y, h.size, h.alpha));
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
})();

// Compliment rotator
(function complimentRotator() {
  const compliments = [
    "You are my favorite notification.",
    "You're the reason my heart does happy dances.",
    "You make ordinary days extraordinary.",
    "My world is softer with you in it.",
    "You are proof that magic is real.",
  ];
  const el = document.getElementById("compliment");
  let i = 0;
  setInterval(() => {
    i = (i + 1) % compliments.length;
    el.textContent = compliments[i];
  }, 4000);
})();

// Surprise button
(function surpriseButton() {
  const btn = document.getElementById("surpriseBtn");
  if (!btn) return;
  const phrases = [
    "I love you more than coffee.",
    "You + Me = Forever.",
    "Your smile is my favorite view.",
    "Still crushing on you.",
  ];
  btn.addEventListener("click", () => {
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    const toast = document.createElement("div");
    toast.textContent = text + "  ❤";
    toast.style.position = "fixed";
    toast.style.bottom = `calc(env(safe-area-inset-bottom, 0px) + 20px)`;
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#ff6b9a";
    toast.style.color = "white";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 10px 24px rgba(255, 107, 154, 0.4)";
    toast.style.zIndex = "3000";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  });
})();

// Lightbox for gallery
(function lightbox() {
  const items = document.querySelectorAll(".masonry-item");
  const overlay = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const close = document.getElementById("lightboxClose");
  if (!items.length) return;
  items.forEach((el) => {
    el.style.cursor = "zoom-in";
    el.addEventListener("click", () => {
      img.src = el.src;
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
    });
  });
  function hide() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }
  close.addEventListener("click", hide);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
})();

// Memory Jar with localStorage
(function memoryJar() {
  const form = document.getElementById("memoryForm");
  const input = document.getElementById("memoryInput");
  const list = document.getElementById("memoryList");
  const clearBtn = document.getElementById("clearJarBtn");
  if (!form) return;

  const STORAGE_KEY = "love_memory_jar_v1";

  function save(memories) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  }
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (_) {
      return [];
    }
  }

  function render() {
    const memories = load();
    list.innerHTML = "";
    memories.forEach((m, idx) => {
      const li = document.createElement("li");
      const text = document.createElement("div");
      text.textContent = m.text;
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = new Date(m.ts).toLocaleString();
      const right = document.createElement("div");
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        const arr = load();
        arr.splice(idx, 1);
        save(arr);
        render();
      });
      right.appendChild(del);
      li.appendChild(text);
      li.appendChild(meta);
      li.appendChild(right);
      list.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    const memories = load();
    memories.unshift({ text: value, ts: Date.now() });
    save(memories);
    input.value = "";
    render();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear all memories?")) {
      save([]);
      render();
    }
  });

  render();
})();

// Countdown
(function countdown() {
  const section = document.getElementById("countdown");
  if (!section) return;
  const target = new Date(section.dataset.targetDate);
  const dd = document.getElementById("dd");
  const hh = document.getElementById("hh");
  const mm = document.getElementById("mm");
  const ss = document.getElementById("ss");

  function update() {
    const diff = Math.max(0, target - new Date());
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    dd.textContent = String(d);
    hh.textContent = String(h).padStart(2, "0");
    mm.textContent = String(m).padStart(2, "0");
    ss.textContent = String(s).padStart(2, "0");
  }
  update();
  setInterval(update, 1000);
})();

