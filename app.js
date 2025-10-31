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
  const closeMenu = () => { if (menu) { menu.hidden = true; } if (burger) { burger.setAttribute('aria-expanded', 'false'); } };
  const openMenu  = () => { if (menu) { menu.hidden = false; } if (burger) { burger.setAttribute('aria-expanded', 'true'); } };

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

  /* =========================================================
     TOOLTIP AUTO-FLIP (haut/bas selon la place disponible)
     - gère hover + focus clavier
     - repositionne au scroll/resize
  ========================================================== */
  const activeTips = new WeakMap();

  const showTip = (el) => {
    const text = el.getAttribute('data-tooltip');
    if (!text) return;

    const tipBox = document.createElement('div');
    tipBox.className = 'tooltip-float';
    tipBox.textContent = text;
    document.body.appendChild(tipBox);

    const place = () => {
      const rect = el.getBoundingClientRect();
      const tipRect = tipBox.getBoundingClientRect();

      let top = rect.top - tipRect.height - 8;
      let left = rect.left + rect.width / 2 - tipRect.width / 2;
      let flip = false;

      if (top < 0) { // si dépasse en haut → placer en bas
        top = rect.bottom + 8;
        flip = true;
      }
      // éviter débordements latéraux
      const margin = 4;
      if (left < margin) left = margin;
      if (left + tipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tipRect.width - margin;
      }

      tipBox.style.top = `${top + window.scrollY}px`;
      tipBox.style.left = `${left}px`;
      tipBox.dataset.flip = flip ? 'bottom' : 'top';
    };

    place();
    // mémoriser pour update/cleanup
    activeTips.set(el, { tipBox, place });

    // Reposition sur scroll/resize
    const onScroll = () => {
      const entry = activeTips.get(el);
      if (entry) entry.place();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // stocker handlers pour suppression
    activeTips.get(el).cleanup = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      tipBox.remove();
      activeTips.delete(el);
    };
  };

  const hideTip = (el) => {
    const entry = activeTips.get(el);
    if (entry && entry.cleanup) entry.cleanup();
  };

  document.querySelectorAll('.tooltip').forEach((tt) => {
    tt.addEventListener('mouseenter', () => showTip(tt));
    tt.addEventListener('mouseleave', () => hideTip(tt));
    tt.addEventListener('focus',     () => showTip(tt));   // accessibilité clavier
    tt.addEventListener('blur',      () => hideTip(tt));
    // (optionnel) support tactile : un tap affiche, retap enlève
    tt.addEventListener('touchstart', () => {
      if (activeTips.has(tt)) hideTip(tt); else showTip(tt);
    }, { passive: true });
  });

  /* =========================================================
     Filet de sécurité RETINA: neutraliser srcset si @2x absent
     (évite 404 des icônes sur écrans DPR>1)
  ========================================================== */
  const imgs = document.querySelectorAll('img.icon-img, img.card-icon-img, img.loupe');
  imgs.forEach(img => {
    const srcset = img.getAttribute('srcset');
    if (!srcset) return;

    const match2x = srcset.split(',').map(s => s.trim()).find(s => s.endsWith('2x'));
    if (!match2x) return;

    const url2x = match2x.split(' ')[0];
    // HEAD pour éviter de télécharger l'image si elle n'existe pas
    fetch(url2x, { method: 'HEAD', cache: 'no-store' })
      .then(r => { if (!r.ok) img.removeAttribute('srcset'); })
      .catch(() => img.removeAttribute('srcset'));
  });

}); // <-- FIN DOMContentLoaded
