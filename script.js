// Révèle les sections en douceur au scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Année dynamique
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

// ----- Modal Contact -----
const modal = document.getElementById('contact-modal');
const openers = document.querySelectorAll('.js-open-contact');
const closers = document.querySelectorAll('.js-close-contact');

function openModal() { modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
function closeModal() { modal.classList.remove('is-open'); document.body.style.overflow = ''; }

openers.forEach(b => b.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); }));
closers.forEach(b => b.addEventListener('click', closeModal));
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

// ----- Envoi via API interne (/api/contact) -----
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

async function submitForm(e){
  e.preventDefault();
  statusEl.textContent = "Envoi en cours…";
  statusEl.className = "form-status";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      statusEl.textContent = "Merci ! Votre message a bien été envoyé.";
      statusEl.className = "form-status success";
      form.reset();
      setTimeout(()=>{ window.location.href = "https://thotmone.com"; }, 2500);
    } else {
      const j = await res.json().catch(()=> ({}));
      statusEl.textContent = j.error || "Erreur lors de l’envoi.";
      statusEl.className = "form-status error";
    }
  } catch (err) {
    statusEl.textContent = "Erreur réseau : impossible d’envoyer le message.";
    statusEl.className = "form-status error";
  }
}
if (form) form.addEventListener('submit', submitForm);

