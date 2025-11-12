// Révélation au scroll (inchangé)
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

// ----- Envoi AJAX vers Formspree -----
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

// ⚠️ Remplace cette URL par ton endpoint Formspree (ex: https://formspree.io/f/abcdxyz)
const FORMSPREE_ENDPOINT = form?.getAttribute('action') || "";

async function submitForm(e){
  e.preventDefault();
  statusEl.textContent = "Envoi en cours…";
  statusEl.className = "form-status";

  const data = new FormData(form);
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    });

    if (res.ok) {
      statusEl.textContent = "Merci ! Votre message a été envoyé.";
      statusEl.className = "form-status success";
      form.reset();
      // Redirection douce après 2,5s
      setTimeout(()=>{ window.location.href = "https://thotmone.com"; }, 2500);
    } else {
      const j = await res.json().catch(()=> ({}));
      const msg = j?.errors?.[0]?.message || "Une erreur est survenue. Réessayez.";
      statusEl.textContent = msg;
      statusEl.className = "form-status error";
    }
  } catch (err) {
    statusEl.textContent = "Impossible d’envoyer le message (réseau).";
    statusEl.className = "form-status error";
  }
}
if (form) form.addEventListener('submit', submitForm);
