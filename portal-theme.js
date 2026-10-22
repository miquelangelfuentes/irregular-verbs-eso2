(() => {
  const STORAGE_KEY = 'eso2-portal-theme';
  const root = document.documentElement;

  if (!document.querySelector('link[data-portal-mobile]')) {
    const mobileStyles = document.createElement('link');
    mobileStyles.rel = 'stylesheet';
    mobileStyles.href = 'portal-mobile.css?v=1';
    mobileStyles.dataset.portalMobile = 'true';
    document.head.appendChild(mobileStyles);
  }

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function getInitialTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function renderToggle(theme = root.dataset.theme || 'light') {
    const button = document.querySelector('.portal-theme-toggle');
    if (!button) return;

    const dark = theme === 'dark';
    const label = dark ? 'Activa el mode clar' : 'Activa el mode fosc';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    button.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}" class="portal-theme-icon" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // La web continua funcionant encara que l'emmagatzematge estigui bloquejat.
      }
    }
    renderToggle(theme);
  }

  function findHeaderActions(header) {
    const soundButton = header.querySelector(
      'button[aria-label*="efectes sonors"], button[title*="efectes sonors"]'
    );
    if (soundButton?.parentElement) {
      return { actions: soundButton.parentElement, soundButton };
    }

    const quickLink = header.querySelector('a[href="#units-grid"], a[href="unit1.html"]');
    if (quickLink?.parentElement) {
      return { actions: quickLink.parentElement, soundButton: null };
    }

    const bar = header.querySelector(':scope > div > div');
    const actions = bar?.lastElementChild || header.querySelector(':scope > div > div:last-child');
    return { actions, soundButton: null };
  }

  function addToggle() {
    const header = document.querySelector('header');
    if (!header) return;

    const { actions, soundButton } = findHeaderActions(header);
    if (!actions) return;

    actions.style.display = 'flex';
    actions.style.alignItems = 'center';
    actions.style.columnGap = '.5rem';

    let button = header.querySelector('.portal-theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'portal-theme-toggle';
      if (soundButton) soundButton.insertAdjacentElement('beforebegin', button);
      else actions.prepend(button);
    } else if (soundButton && button.parentElement !== actions) {
      soundButton.insertAdjacentElement('beforebegin', button);
    }

    if (button.dataset.themeBound !== 'true') {
      button.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
      button.dataset.themeBound = 'true';
    }

    renderToggle();
  }

  function addQuickAccessCard() {
    if (document.querySelector('.portal-access-card')) return;
    const home = document.getElementById('view-home');
    const hero = home?.querySelector(':scope > div:first-child');
    if (!home || !hero) return;

    if (!document.getElementById('portal-access-card-styles')) {
      const style = document.createElement('style');
      style.id = 'portal-access-card-styles';
      style.textContent = `
        .portal-access-card{display:grid;grid-template-columns:minmax(0,1fr) 176px;gap:1.5rem;align-items:center;padding:1.25rem 1.5rem;background:var(--portal-surface);border:1px solid var(--portal-border);border-radius:var(--portal-radius-card);box-shadow:var(--portal-shadow)}
        .portal-access-title{display:flex;align-items:center;gap:.55rem;margin:0 0 .4rem;font-family:var(--portal-font-display);font-size:1.125rem;font-weight:700;color:var(--portal-text)}
        .portal-access-title svg{width:22px;height:22px;flex:0 0 22px;color:var(--portal-brand-600)}
        .portal-access-card p{margin:0 0 .85rem;color:var(--portal-muted);font-size:.95rem;line-height:1.55}
        .portal-access-url{display:inline-flex;align-items:center;gap:.45rem;min-height:44px;padding:.55rem .8rem;border:1px solid var(--portal-brand-200);border-radius:var(--portal-radius-control);background:var(--portal-brand-50);color:var(--portal-brand-700);font-weight:800;text-decoration:none}
        .portal-access-url:hover{text-decoration:underline}
        .portal-access-url svg{width:18px;height:18px;flex:0 0 18px}
        .portal-access-qr{justify-self:center;display:block;padding:.5rem;background:#fff;border:1px solid var(--portal-border);border-radius:var(--portal-radius-control)}
        .portal-access-qr img{display:block;width:156px;height:156px}
        @media(max-width:600px){.portal-access-card{grid-template-columns:1fr;text-align:center;padding:1.1rem}.portal-access-title,.portal-access-url{justify-content:center}.portal-access-qr img{width:168px;height:168px}}
      `;
      document.head.appendChild(style);
    }

    const card = document.createElement('section');
    card.className = 'portal-access-card';
    card.setAttribute('aria-labelledby', 'portal-access-title');
    card.innerHTML = `
      <div>
        <h2 id="portal-access-title" class="portal-access-title"><i data-lucide="smartphone" aria-hidden="true"></i><span>Accés ràpid a Verb Quest</span></h2>
        <p>Escriu l’adreça curta o escaneja el codi QR amb el mòbil.</p>
        <a class="portal-access-url" href="https://ja.cat/quercus-2eso-verbs" target="_blank" rel="noopener">
          <span>ja.cat/quercus-2eso-verbs</span>
          <i data-lucide="external-link" aria-hidden="true"></i>
        </a>
      </div>
      <a class="portal-access-qr" href="https://ja.cat/quercus-2eso-verbs" target="_blank" rel="noopener" aria-label="Obrir ja.cat/quercus-2eso-verbs">
        <img src="assets/qr-quercus-2eso-verbs.svg" width="156" height="156" alt="Codi QR per accedir a Verb Quest">
      </a>
    `;
    hero.insertAdjacentElement('afterend', card);
    window.lucide?.createIcons();
  }

  function initPortalChrome() {
    addToggle();
    addQuickAccessCard();
  }

  applyTheme(getInitialTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalChrome, { once: true });
  } else {
    initPortalChrome();
  }
})();
