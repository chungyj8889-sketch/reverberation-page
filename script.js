const meter = document.querySelector(".scroll-meter span");
const echoLayer = document.querySelector(".echo-layer");
const rules = Array.from(document.querySelectorAll(".rule"));
const echoWords = ["잔향", "부재", "침묵", "기억", "반사", "소멸"];

function updateMeter() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  meter.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}

function makeEcho(rule, event) {
  const rect = rule.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;
  const signal = rule.dataset.echo || "잔향";
  const words = [signal, ...echoWords].slice(0, 6);

  echoLayer.style.setProperty("--echo-x", `${x}px`);
  echoLayer.style.setProperty("--echo-y", `${y}px`);
  document.body.classList.remove("is-echoing");
  void document.body.offsetWidth;
  document.body.classList.add("is-echoing");

  for (let i = 0; i < 3; i += 1) {
    const ring = document.createElement("span");
    ring.className = "echo-ring";
    ring.style.setProperty("--x", `${x}px`);
    ring.style.setProperty("--y", `${y}px`);
    ring.style.animationDelay = `${i * 110}ms`;
    echoLayer.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove(), { once: true });
  }

  words.forEach((word, index) => {
    const chip = document.createElement("span");
    const angle = (Math.PI * 2 * index) / words.length - Math.PI / 2;
    const distance = 46 + index * 13;
    chip.className = "echo-word";
    chip.textContent = word;
    chip.style.setProperty("--x", `${x + Math.cos(angle) * distance}px`);
    chip.style.setProperty("--y", `${y + Math.sin(angle) * distance}px`);
    chip.style.setProperty("--drift", `${-42 - index * 8}px`);
    chip.style.animationDelay = `${index * 45}ms`;
    echoLayer.appendChild(chip);
    chip.addEventListener("animationend", () => chip.remove(), { once: true });
  });

  rule.classList.remove("is-echoing");
  void rule.offsetWidth;
  rule.classList.add("is-echoing");
  window.setTimeout(() => rule.classList.remove("is-echoing"), 720);
  window.setTimeout(() => document.body.classList.remove("is-echoing"), 980);
}

rules.forEach((rule) => {
  rule.addEventListener("click", (event) => {
    const isActive = rule.classList.contains("is-active");
    rules.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });

    if (!isActive) {
      rule.classList.add("is-active");
      rule.setAttribute("aria-pressed", "true");
    }

    makeEcho(rule, event);
  });
});

window.addEventListener("scroll", updateMeter, { passive: true });
window.addEventListener("resize", updateMeter);
updateMeter();
