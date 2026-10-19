// Verb Quest - millores pedagògiques, adaptatives i d'accessibilitat
(() => {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  function ensureExtendedStats() {
    state.userStats.errorsByVerb ??= {};
    state.userStats.packQuizScores ??= {};
    state.userStats.packTypeScores ??= {};
  }

  ensureExtendedStats();

  function findVerbFromCandidate(candidate) {
    if (!candidate) return null;
    if (typeof candidate === 'number') return VERBS_DATA.find(v => v.id === candidate) || null;
    if (typeof candidate === 'string') {
      const value = candidate.trim().toLowerCase();
      return VERBS_DATA.find(v => [v.v1, v.v2, v.v3].some(x => String(x).toLowerCase() === value)) || null;
    }
    if (candidate.v1) return VERBS_DATA.find(v => v.id === candidate.id || v.v1 === candidate.v1) || candidate;
    for (const key of ['verb', 'targetVerb', 'item']) {
      if (candidate[key]) {
        const found = findVerbFromCandidate(candidate[key]);
        if (found) return found;
      }
    }
    for (const key of ['verbId', 'id']) {
      if (Number.isInteger(candidate[key])) {
        const found = VERBS_DATA.find(v => v.id === candidate[key]);
        if (found) return found;
      }
    }
    return null;
  }

  function inferCurrentVerb() {
    const g = state.game || {};
    const candidates = [
      g.typeItems?.[g.typeIndex],
      g.quizQuestions?.[g.quizIndex],
      g.cpQuestions?.[g.cpIndex],
      g.speedCurrentQ,
      g.survCurrentQ,
      g.wheelSelectedVerb
    ];
    for (const candidate of candidates) {
      const found = findVerbFromCandidate(candidate);
      if (found) return found;
    }
    if (g.scrambleTargetWord) return findVerbFromCandidate(g.scrambleTargetWord);
    return null;
  }

  function recordVerbAttempt(verb, correct) {
    if (!verb?.id) return;
    ensureExtendedStats();
    const key = String(verb.id);
    const entry = state.userStats.errorsByVerb[key] || { errors: 0, corrects: 0, lastSeen: null };
    if (correct) entry.corrects += 1;
    else entry.errors += 1;
    entry.lastSeen = new Date().toISOString();
    state.userStats.errorsByVerb[key] = entry;
    saveUserStats();
  }

  const originalSuccessSound = playSuccessSound;
  playSuccessSound = function (...args) {
    const verb = inferCurrentVerb();
    if (verb) recordVerbAttempt(verb, true);
    return originalSuccessSound.apply(this, args);
  };

  const originalErrorSound = playErrorSound;
  playErrorSound = function (...args) {
    const verb = inferCurrentVerb();
    if (verb) recordVerbAttempt(verb, false);
    return originalErrorSound.apply(this, args);
  };

  function recalculatePackMastery(packId) {
    ensureExtendedStats();
    const quiz = Number(state.userStats.packQuizScores[packId] || 0);
    const written = Number(state.userStats.packTypeScores[packId] || 0);
    let stars = 0;
    if (quiz >= 60 || written >= 60) stars = 1;
    if (quiz >= 80 && written >= 80) stars = 2;
    if (quiz >= 90 && written >= 90) stars = 3;
    state.userStats.packStars[packId] = stars;
    saveUserStats();
    return stars;
  }

  const originalFinishQuiz = finishQuiz;
  finishQuiz = function (...args) {
    ensureExtendedStats();
    const total = state.game.quizQuestions.length || 1;
    const pct = Math.round((state.game.quizScore / total) * 100);
    state.userStats.packQuizScores[state.activePackId] = Math.max(
      Number(state.userStats.packQuizScores[state.activePackId] || 0),
      pct
    );
    const result = originalFinishQuiz.apply(this, args);
    const stars = recalculatePackMastery(state.activePackId);
    const starsEl = document.getElementById('quiz-final-stars');
    if (starsEl) starsEl.textContent = `${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
    const pctEl = document.getElementById('quiz-final-pct');
    if (pctEl && Number(state.userStats.packTypeScores[state.activePackId] || 0) < 80) {
      pctEl.textContent = `${pct}% d'encert - completa també «Escriu les formes» per dominar el pack`;
    }
    return result;
  };

  const originalRenderTypeItem = renderTypeItem;
  renderTypeItem = function (...args) {
    const result = originalRenderTypeItem.apply(this, args);
    const items = state.game.typeItems || [];
    if (items.length && state.game.typeIndex >= items.length) {
      ensureExtendedStats();
      const pct = Math.round((state.game.typeScore / items.length) * 100);
      state.userStats.packTypeScores[state.activePackId] = Math.max(
        Number(state.userStats.packTypeScores[state.activePackId] || 0),
        pct
      );
      const stars = recalculatePackMastery(state.activePackId);
      const resultsArea = document.getElementById('type-results-area');
      if (resultsArea && !resultsArea.querySelector('[data-mastery-note]')) {
        const note = document.createElement('p');
        note.dataset.masteryNote = 'true';
        note.className = 'mt-3 text-xs sm:text-sm text-slate-600 text-center';
        note.textContent = stars >= 2
          ? `Pack dominat: ${stars} de 3 estrelles. El domini combina el quiz i la producció escrita.`
          : 'Per considerar el pack dominat cal arribar com a mínim al 80% tant al quiz com a «Escriu les formes».';
        resultsArea.appendChild(note);
      }
    }
    return result;
  };

  function getErrorEntries() {
    ensureExtendedStats();
    return Object.entries(state.userStats.errorsByVerb)
      .map(([id, stats]) => ({
        verb: VERBS_DATA.find(v => v.id === Number(id)),
        errors: Number(stats.errors || 0),
        corrects: Number(stats.corrects || 0),
        lastSeen: stats.lastSeen || ''
      }))
      .filter(item => item.verb && item.errors > 0)
      .sort((a, b) => (b.errors - b.corrects) - (a.errors - a.corrects) || b.errors - a.errors);
  }

  let adaptiveReview = [];
  let adaptiveIndex = 0;
  let adaptiveScore = 0;

  function renderReviewErrors() {
    const container = document.getElementById('review-errors-content');
    if (!container) return;
    const entries = getErrorEntries();
    if (!entries.length) {
      container.innerHTML = `
        <div class="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><i data-lucide="check-circle-2" class="w-7 h-7"></i></div>
          <h2 class="font-display font-bold text-xl text-slate-900">Encara no hi ha errors per repassar</h2>
          <p class="text-sm text-slate-600 mt-2">Quan t'equivoquis en una activitat, els verbs apareixeran aquí perquè els puguis recuperar escrivint-los.</p>
          <button onclick="navigateTo('packs-list')" class="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">Anar als packs d'aprenentatge</button>
        </div>`;
    } else {
      const top = entries.slice(0, 12);
      container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-rose-600">Repàs adaptatiu</span>
            <h2 class="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">Els verbs que et costen més</h2>
            <p class="text-sm text-slate-600 mt-2 max-w-2xl">La llista es construeix només amb les teves respostes en aquest navegador. Els verbs amb més errors apareixen primer.</p>
          </div>
          <button onclick="startAdaptiveReview()" class="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shrink-0">Practica'ls escrivint</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${top.map(({verb, errors, corrects}) => `
            <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div><h3 class="font-display font-bold text-lg text-slate-900">${verb.v1}</h3><p class="text-xs text-slate-500">${verb.cat}</p></div>
                <span class="text-xs font-bold px-2 py-1 rounded-lg bg-rose-50 text-rose-700">${errors} errors</span>
              </div>
              <p class="mt-3 text-sm font-semibold text-slate-700">${verb.v2} - ${verb.v3}</p>
              <p class="mt-2 text-xs text-slate-500">Encerts registrats ${corrects}</p>
            </article>`).join('')}
        </div>`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  window.startAdaptiveReview = function () {
    const entries = getErrorEntries().slice(0, 10);
    adaptiveReview = entries.map(x => x.verb);
    adaptiveIndex = 0;
    adaptiveScore = 0;
    renderAdaptiveQuestion();
  };

  function renderAdaptiveQuestion() {
    const container = document.getElementById('review-errors-content');
    if (!container) return;
    if (adaptiveIndex >= adaptiveReview.length) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 class="font-display font-bold text-2xl text-slate-900">Repàs completat</h2>
          <p class="text-slate-600 mt-2">Has recuperat ${adaptiveScore} de ${adaptiveReview.length} verbs sense errors.</p>
          <button onclick="renderReviewErrorsFromUI()" class="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">Tornar al meu repàs</button>
        </div>`;
      return;
    }
    const verb = adaptiveReview[adaptiveIndex];
    container.innerHTML = `
      <div class="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div class="flex items-center justify-between text-xs font-bold text-slate-500 mb-5"><span>Repàs d'errors</span><span>${adaptiveIndex + 1} / ${adaptiveReview.length}</span></div>
        <p class="text-sm text-slate-500">Escriu les dues formes que falten.</p>
        <h2 class="font-display font-bold text-3xl text-slate-900 mt-1">${verb.v1}</h2>
        <p class="text-sm text-slate-600 mt-1">${verb.cat}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <label class="text-xs font-bold text-slate-600">Past simple (V2)<input id="adaptive-v2" autocomplete="off" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" /></label>
          <label class="text-xs font-bold text-slate-600">Past participle (V3)<input id="adaptive-v3" autocomplete="off" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" /></label>
        </div>
        <div id="adaptive-feedback" class="hidden mt-4 text-sm rounded-xl p-3" role="status" aria-live="polite"></div>
        <button id="adaptive-submit" onclick="checkAdaptiveReview()" class="mt-5 w-full px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">Comprova</button>
      </div>`;
    document.getElementById('adaptive-v2')?.focus();
  }

  window.checkAdaptiveReview = function () {
    const verb = adaptiveReview[adaptiveIndex];
    const v2 = document.getElementById('adaptive-v2')?.value || '';
    const v3 = document.getElementById('adaptive-v3')?.value || '';
    const ok = checkVerbMatch(v2, verb.v2, verb.accept_v2) && checkVerbMatch(v3, verb.v3, verb.accept_v3);
    const feedback = document.getElementById('adaptive-feedback');
    if (ok) {
      adaptiveScore += 1;
      recordVerbAttempt(verb, true);
      feedback.className = 'mt-4 text-sm rounded-xl p-3 bg-emerald-50 text-emerald-800';
      feedback.textContent = `Correcte: ${verb.v1} - ${verb.v2} - ${verb.v3}`;
    } else {
      recordVerbAttempt(verb, false);
      feedback.className = 'mt-4 text-sm rounded-xl p-3 bg-rose-50 text-rose-800';
      feedback.textContent = `Revisa-ho: ${verb.v1} - ${verb.v2} - ${verb.v3}`;
    }
    feedback.classList.remove('hidden');
    const button = document.getElementById('adaptive-submit');
    button.textContent = adaptiveIndex + 1 < adaptiveReview.length ? 'Següent' : 'Veure resultat';
    button.onclick = () => { adaptiveIndex += 1; renderAdaptiveQuestion(); };
  };

  window.renderReviewErrorsFromUI = renderReviewErrors;

  const originalNavigateTo = navigateTo;
  let applyingHistory = false;

  function hashFor(viewId, params = {}) {
    if (viewId === 'pack-detail' && params.packId) return `#pack/${params.packId}`;
    if (viewId === 'checkpoint-game' && params.cpId) return `#checkpoint/${params.cpId}`;
    const map = {
      home: '#home',
      'packs-list': '#packs',
      'checkpoints-list': '#checkpoints',
      'all-verbs-hub': '#finals',
      explorer: '#dictionary',
      'review-errors': '#review'
    };
    return map[viewId] || `#${viewId}`;
  }

  navigateTo = function (viewId, params = {}) {
    if (viewId === 'review-errors') {
      state.currentView = viewId;
      document.querySelectorAll('.view-screen').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById('view-review-errors');
      target?.classList.remove('hidden');
      renderReviewErrors();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    } else {
      originalNavigateTo(viewId, params);
    }
    if (!applyingHistory) {
      const hash = hashFor(viewId, params);
      if (location.hash !== hash) history.pushState({ viewId, params }, '', hash);
    }
    requestAnimationFrame(() => {
      const active = document.querySelector('.view-screen:not(.hidden)');
      const heading = active?.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
      enhanceInteractiveElements(active || document);
    });
  };

  function routeFromHash() {
    const raw = location.hash.replace(/^#/, '');
    let viewId = 'home';
    let params = {};
    if (raw.startsWith('pack/')) { viewId = 'pack-detail'; params.packId = Number(raw.split('/')[1]); }
    else if (raw.startsWith('checkpoint/')) { viewId = 'checkpoint-game'; params.cpId = Number(raw.split('/')[1]); }
    else {
      const map = { home: 'home', packs: 'packs-list', checkpoints: 'checkpoints-list', finals: 'all-verbs-hub', dictionary: 'explorer', review: 'review-errors' };
      viewId = map[raw] || 'home';
    }
    applyingHistory = true;
    navigateTo(viewId, params);
    applyingHistory = false;
  }

  window.addEventListener('popstate', routeFromHash);
  window.addEventListener('hashchange', routeFromHash);

  function enhanceInteractiveElements(root = document) {
    root.querySelectorAll?.('[onclick]').forEach(el => {
      if (!['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        if (!el.dataset.keyboardReady) {
          el.dataset.keyboardReady = 'true';
          el.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              el.click();
            }
          });
        }
      }
    });
    root.querySelectorAll?.('button').forEach(button => {
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        const label = button.getAttribute('title');
        if (label) button.setAttribute('aria-label', label);
      }
    });
  }

  const observer = new MutationObserver(() => enhanceInteractiveElements(document));
  observer.observe(document.body, { childList: true, subtree: true });
  enhanceInteractiveElements(document);

  const toast = document.getElementById('toast-container');
  if (toast) {
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
  }

  if (location.hash && location.hash !== '#home') routeFromHash();
})();
