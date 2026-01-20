const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Menu mobile
const menuBtn = $("#menuBtn");
const nav = $("#nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn?.setAttribute("aria-expanded", String(open));
}

menuBtn?.addEventListener("click", () => {
  const isOpen = nav.classList.contains("open");
  setMenu(!isOpen);
});

$$(".nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));

document.addEventListener("click", (e) => {
  if (!nav || !menuBtn) return;
  const clickedInside = nav.contains(e.target) || menuBtn.contains(e.target);
  if (!clickedInside) setMenu(false);
});

// Ano no footer
$("#year").textContent = new Date().getFullYear();


// Reveal ao rolar (suave) + stagger em listas de cards
const revealTargets = $$(".hero, .section, .tile, .benefit, .portfolio-card, .steps, .card");
revealTargets.forEach(el => el.classList.add("reveal"));

const ioReveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    ioReveal.unobserve(e.target);
  });
}, { threshold: 0.14 });

revealTargets.forEach(el => ioReveal.observe(el));

// Stagger (sequência) para grids
const staggerGroups = [
  ...$$(".grid-3"),
  ...$$(".grid-2"),
  ...$$(".grid-1"),
  ...$$(".contact-grid"),
  ...$$(".steps")
];

staggerGroups.forEach(group => {
  const items = Array.from(group.children).filter(n => n.classList);
  items.forEach((item, idx) => item.classList.add(`stagger-${idx % 6}`));
});


// Scrollspy (destaca seção ativa no header)
const navLinks = $$(".nav a").filter(a => (a.getAttribute("href") || "").startsWith("#"));
const sections = navLinks.map(a => $(a.getAttribute("href"))).filter(Boolean);

const ioNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

sections.forEach(s => ioNav.observe(s));

// Barra de progresso do scroll (minimalista)
const progressEl = $("#scrollProgress");

function updateProgress(){
  if (!progressEl) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressEl.style.width = `${p}%`;
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
