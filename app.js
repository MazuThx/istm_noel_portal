/* app.js – interactions de base */
document.addEventListener('DOMContentLoaded', () => {
  /* Placeholder search qui disparaît au focus */
  const input = document.querySelector('#q');
  if (input) {
    const ph = input.getAttribute('placeholder') || '';
    input.addEventListener('focus', () => input.setAttribute('placeholder', ''));
    input.addEventListener('blur', () => input.setAttribute('placeholder', ph));
  }

  /* Badges (3 et 4) */
  const setBadge = (el, val) => {
    if (!el) return;
    const n = Number(val) || 0;
    el.textContent = String(n);
    el.style.display = n > 0 ? 'inline-block' : 'none';
    el.setAttribute('aria-label', `${n} notifications`);
  };
  setBadge(document.querySelector('[data-badge="ticket"]'), 3);
  setBadge(document.querySelector('[data-badge="validation"]'), 4);

  /* Menu burger accessible */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mainmenu');
  const closeMenu = () => { if(menu){ menu.hidden = true; } if(burger){ burger.setAttribute('aria-expanded','false'); } };
  const openMenu  = () => { if(menu){ menu.hidden = false;} if(burger){ burger.setAttribute('aria-expanded','true');  } };

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* Background toggles (image / vidéo) */
  const body = document.body;
  const bgVideo = document.getElementById('bgVideo');
  const applyBackground = (mode) => {
    if (mode === 'video') {
      body.classList.remove('bg-image'); body.classList.add('bg-video');
      if (bgVideo && bgVideo.paused) { bgVideo.play().catch(()=>{}); }
      body.dataset.background = 'video';
    } else {
      body.classList.remove('bg-video'); body.classList.add('bg-image');
      if (bgVideo && !bgVideo.paused) { bgVideo.pause(); }
      body.dataset.background = 'image';
    }
  };
  applyBackground(body.dataset.background === 'video' ? 'video' : 'image');

  // API globale simple
  window.BG = { set: applyBackground, mode: () => body.dataset.background };

  /* Chatbot anchor (focus) */
  const chatbotBtn = document.getElementById('chatbot-btn');
  const chatbotAnchor = document.getElementById('chatbot');
  if (chatbotBtn && chatbotAnchor) {
    chatbotBtn.addEventListener('click', () => setTimeout(() => chatbotAnchor.focus(), 50));
  }
});
