(() => {
  const STORAGE_KEY = 'eso2-portal-theme';
  const root = document.documentElement;

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

  applyTheme(getInitialTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToggle, { once: true });
  } else {
    addToggle();
  }
})();
