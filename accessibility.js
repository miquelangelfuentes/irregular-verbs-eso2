// Ajustos finals d'accessibilitat de Verb Quest
(() => {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  if (reduceMotion && typeof triggerConfetti === 'function') {
    triggerConfetti = function () {};
  }

  const soundButton = [...document.querySelectorAll('button')].find(button =>
    (button.getAttribute('title') || '').includes('efectes sonors')
  );

  if (soundButton) {
    const syncSoundState = () => {
      soundButton.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
      soundButton.setAttribute(
        'aria-label',
        state.soundEnabled ? 'Desactiva els efectes sonors' : 'Activa els efectes sonors'
      );
    };
    soundButton.addEventListener('click', () => requestAnimationFrame(syncSoundState));
    syncSoundState();
  }
})();
