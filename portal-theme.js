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
    updateToggle(theme);
  }

  function updateToggle(theme = root.dataset.theme || 'light') {
    const button = document.querySelector('.portal-theme-toggle');
    if (!button) return;
    const dark = theme === 'dark';
    const label = dark ? 'Activa el mode clar' : 'Activa el mode fosc';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  function addToggle() {
    const header = document.querySelector('header');
    if (!header || header.querySelector('.portal-theme-toggle')) return;

    const headerBar = header.querySelector(':scope > div > div');
    const actions = headerBar?.lastElementChild;
    if (!actions) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portal-theme-toggle';
    button.innerHTML = [
      '<i data-lucide="moon" class="portal-theme-icon portal-theme-icon-moon" aria-hidden="true"></i>',
      '<i data-lucide="sun" class="portal-theme-icon portal-theme-icon-sun" aria-hidden="true"></i>',
      '<span class="sr-only">Canvia el mode de color</span>'
    ].join('');

    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });

    actions.prepend(button);
    updateToggle();
    window.lucide?.createIcons();
  }

  applyTheme(getInitialTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToggle, { once: true });
  } else {
    addToggle();
  }
})();
