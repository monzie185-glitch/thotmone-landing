// Révèle les sections en douceur au scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Année dynamique dans le footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
