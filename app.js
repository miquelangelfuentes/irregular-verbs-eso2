// Verb Quest 2n ESO - Lògica principal de l'aplicació
// Gestió d'estat, jocs, àudio Web Speech, efectes de so Web Audio i persistència.

// --- ESTAT GLOBAL ---
const state = {
  currentView: 'home',
  activePackId: 1,
  activeCheckpointId: 1,
  activeGameId: 'flashcards',
  soundEnabled: true,
  userStats: {
    packStars: {},          // { packId: stars 0-3 }
    checkpointBadges: {},   // { cpId: boolean }
    speedrunHighScore: 0,
    survivalHighScore: 0,
    impostorHighScore: 0,
    trioMatchBestMoves: 0,
    examsCompleted: 0
  },
  // Estat de jocs puntuals
  game: {
    // Flashcards
    fcIndex: 0,
    fcFlipped: false,
    fcLearned: {},
    // Quiz
    quizQuestions: [],
    quizIndex: 0,
    quizScore: 0,
    quizStreak: 0,
    quizAnswered: false,
    // Escriu la forma
    typeItems: [],
    typeIndex: 0,
    typeScore: 0,
    // Memory
    memoryCards: [],
    memoryFlippedCards: [],
    memoryMatchedCount: 0,
    memoryMoves: 0,
    memoryTimer: 0,
    memoryInterval: null,
    // Scramble
    scrambleItems: [],
    scrambleIndex: 0,
    scrambleCurrentWord: '',
    scrambleTargetWord: '',
    scramblePickedLetters: [],
    scrambleScore: 0,
    // Checkpoint
    cpQuestions: [],
    cpIndex: 0,
    cpScore: 0,
    // Speedrun
    speedTimer: 60,
    speedInterval: null,
    speedScore: 0,
    speedStreak: 0,
    speedCurrentQ: null,
    // Survival
    survLives: 3,
    survScore: 0,
    survCurrentQ: null,
    survLifelines: { half: true, skip: true, hint: true },
    // Exam
    examVerbs: [],
    examRows: [],
    examEvaluated: false,
    examGrade: 0,
    // Wheel
    wheelSpinning: false,
    wheelAngle: 0,
    wheelSelectedVerb: null,
    // Detector d'intrusos
    impostorRounds: [],
    impostorRoundIndex: 0,
    impostorScore: 0,
    impostorStreak: 0,
    impostorAnswered: false,
    // Trencaclosques de trios
    trioCards: [],
    trioSelected: [],
    trioMatchedCount: 0,
    trioMoves: 0,
    trioTimer: 0,
    trioInterval: null
  }
};

// --- PERSISTÈNCIA (localStorage) ---
function loadUserStats() {
  try {
    const saved = localStorage.getItem('verbquest_2eso_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.userStats = Object.assign(state.userStats, parsed);
    }
  } catch (e) {
    console.warn("No s'ha pogut carregar l'estat de localStorage", e);
  }
}

function saveUserStats() {
  try {
    localStorage.setItem('verbquest_2eso_data', JSON.stringify(state.userStats));
  } catch (e) {
    console.warn("No s'ha pogut desar l'estat a localStorage", e);
  }
  updateGlobalStatsHeader();
}

function resetAllData() {
  if (confirm("Segur que vols reiniciar tot el progrés (estrelles, medalles i rècords)?")) {
    state.userStats = {
      packStars: {},
      checkpointBadges: {},
      speedrunHighScore: 0,
      survivalHighScore: 0,
      impostorHighScore: 0,
      trioMatchBestMoves: 0,
      examsCompleted: 0
    };
    saveUserStats();
    showNotification("Progrés reiniciat correctament!", "info");
    navigateTo('home');
  }
}

// --- SISTEMA D'ÀUDIO ---
// 1. Web Speech API (Text a veu en anglès)
function speakEnglish(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // atura reproduccions pendents
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB'; // Anglès britànic estàndard escolar
  utterance.rate = 0.9;     // Lleugerament més pausat per a 2n d'ESO
  utterance.pitch = 1.0;

  // Busca veu en anglès si n'hi ha disponible
  const voices = window.speechSynthesis.getVoices();
  const gbVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en_GB'));
  if (gbVoice) utterance.voice = gbVoice;

  window.speechSynthesis.speak(utterance);
}

// 2. Web Audio API per a efectes de so suaus
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSuccessSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now);
    osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (e) {}
}

function playErrorSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(160, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
}

function playFanfareSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  } catch (e) {}
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// --- UTILITATS DE VALIDACIÓ ---
function cleanInput(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

function checkVerbMatch(userVal, canonical, acceptedList) {
  const cleaned = cleanInput(userVal);
  if (!cleaned) return false;
  if (cleanInput(canonical) === cleaned) return true;
  if (Array.isArray(acceptedList)) {
    return acceptedList.some(alt => cleanInput(alt) === cleaned);
  }
  return false;
}

// --- NAVEGACIÓ ENTRE VISTES ---
function navigateTo(viewId, params = {}) {
  state.currentView = viewId;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Amaga totes les vistes
  document.querySelectorAll('.view-screen').forEach(el => el.classList.add('hidden'));

  // Activa la vista seleccionada
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden');
  }

  // Lògica d'inicialització segons la vista
  if (viewId === 'home') {
    if (window.location.hash === '#finals') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    renderHome();
  } else if (viewId === 'packs-list') {
    renderPacksList();
  } else if (viewId === 'pack-detail') {
    if (params.packId) state.activePackId = parseInt(params.packId, 10);
    renderPackDetail();
  } else if (viewId === 'checkpoints-list') {
    renderCheckpointsList();
  } else if (viewId === 'checkpoint-game') {
    if (params.cpId) state.activeCheckpointId = parseInt(params.cpId, 10);
    startCheckpointGame();
  } else if (viewId === 'all-verbs-hub') {
    if (window.location.hash !== '#finals') {
      history.replaceState(null, '', '#finals');
    }
    renderAllVerbsHub();
  } else if (viewId === 'game-speedrun') {
    startSpeedrun();
  } else if (viewId === 'game-survival') {
    startSurvival();
  } else if (viewId === 'game-exam') {
    setupExam();
  } else if (viewId === 'game-wheel') {
    setupWheel();
  } else if (viewId === 'game-impostor') {
    startImpostorGame();
  } else if (viewId === 'game-trio-match') {
    startTrioMatchGame();
  } else if (viewId === 'explorer') {
    renderExplorer();
  }

  updateGlobalStatsHeader();
  if (window.lucide) window.lucide.createIcons();
}

// --- ACTUALITZACIÓ DE CAPÇALERA I ESTADÍSTIQUES ---
function updateGlobalStatsHeader() {
  const starCount = Object.values(state.userStats.packStars).reduce((a, b) => a + b, 0);
  const badgeCount = Object.values(state.userStats.checkpointBadges).filter(Boolean).length;
  
  const starEl = document.getElementById('header-stars');
  const badgeEl = document.getElementById('header-badges');
  if (starEl) starEl.textContent = `${starCount} / 33 ⭐`;
  if (badgeEl) badgeEl.textContent = `${badgeCount} / 6 🏅`;
}

function showNotification(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
  toast.className = `${bg} text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0`;
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);
  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================================
// 1. VISTA: HOME (DASHBOARD)
// ==========================================
function renderHome() {
  const packsMastered = Object.values(state.userStats.packStars).filter(s => s >= 2).length;
  const badgesEarned = Object.values(state.userStats.checkpointBadges).filter(Boolean).length;
  
  const elProgress = document.getElementById('home-overall-progress');
  if (elProgress) {
    const pct = Math.round((packsMastered / 11) * 100);
    elProgress.style.width = `${pct}%`;
  }
  const elPctText = document.getElementById('home-progress-text');
  if (elPctText) {
    elPctText.textContent = `${packsMastered} de 11 packs dominats`;
  }
}

// ==========================================
// 2. VISTA: LLISTA DE PACKS (10 VERBS ALFABÈTICAMENT)
// ==========================================
function renderPacksList() {
  const grid = document.getElementById('packs-grid');
  if (!grid) return;
  grid.innerHTML = '';

  PACKS_META.forEach(pack => {
    const stars = state.userStats.packStars[pack.id] || 0;
    const verbsInPack = VERBS_DATA.filter(v => v.pack === pack.id);
    const firstVerb = verbsInPack[0]?.v1 || '';
    const lastVerb = verbsInPack[verbsInPack.length - 1]?.v1 || '';

    let starsHtml = '';
    for (let i = 1; i <= 3; i++) {
      starsHtml += i <= stars ? '⭐' : '☆';
    }

    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between";
    card.onclick = () => navigateTo('pack-detail', { packId: pack.id });

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            Nivell ${pack.id} - ${pack.count} verbs
          </span>
          <span class="text-sm tracking-widest text-amber-500 font-bold">${starsHtml}</span>
        </div>
        <h3 class="font-display font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
          ${pack.title}
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          D'ordre alfabètic: <strong>${firstVerb}</strong> a <strong>${lastVerb}</strong>
        </p>
      </div>

      <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs font-semibold text-slate-400">2n d'ESO</span>
        <span class="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
          Jugar pack ➔
        </span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==========================================
// 3. VISTA: DETALL DEL PACK I ELS SEUS 5 JOCS
// ==========================================
function renderPackDetail() {
  const pack = PACKS_META.find(p => p.id === state.activePackId) || PACKS_META[0];
  const verbs = VERBS_DATA.filter(v => v.pack === pack.id);

  document.getElementById('pack-detail-title').textContent = pack.title;
  document.getElementById('pack-detail-subtitle').textContent = `Verbs ${pack.range} (${pack.count} verbs irregulars)`;
  
  // Tab selector per canviar entre els 5 jocs del pack
  setPackGameMode(state.activeGameId || 'flashcards');
}

function setPackGameMode(gameMode) {
  state.activeGameId = gameMode;
  
  // Actualitza estils dels botons de pestanyes
  document.querySelectorAll('.pack-game-tab').forEach(tab => {
    if (tab.dataset.game === gameMode) {
      tab.className = 'pack-game-tab px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-2';
    } else {
      tab.className = 'pack-game-tab px-4 py-2 rounded-xl text-sm font-semibold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-2';
    }
  });

  // Amaga tots els sub-jocs
  document.querySelectorAll('.pack-subgame').forEach(el => el.classList.add('hidden'));

  const container = document.getElementById(`pack-subgame-${gameMode}`);
  if (container) container.classList.remove('hidden');

  const verbs = VERBS_DATA.filter(v => v.pack === state.activePackId);

  if (gameMode === 'flashcards') initFlashcards(verbs);
  else if (gameMode === 'quiz') initQuiz(verbs);
  else if (gameMode === 'type') initTypeGame(verbs);
  else if (gameMode === 'memory') initMemoryGame(verbs);
  else if (gameMode === 'scramble') initScrambleGame(verbs);

  if (window.lucide) window.lucide.createIcons();
}

// --- JOC 1: FLASHCARDS INTERACTIVES 3D ---
function initFlashcards(verbs) {
  state.game.fcIndex = 0;
  state.game.fcFlipped = false;
  renderFlashcard(verbs);
}

function renderFlashcard(verbs) {
  const verb = verbs[state.game.fcIndex];
  if (!verb) return;

  const cardInner = document.getElementById('fc-card-inner');
  if (cardInner) {
    cardInner.classList.remove('is-flipped');
    state.game.fcFlipped = false;
  }

  document.getElementById('fc-counter').textContent = `${state.game.fcIndex + 1} / ${verbs.length}`;
  document.getElementById('fc-front-v1').textContent = verb.v1;
  document.getElementById('fc-front-cat').textContent = verb.cat;
  document.getElementById('fc-front-phonetic').textContent = verb.p1 || '';

  document.getElementById('fc-back-v1').textContent = verb.v1;
  document.getElementById('fc-back-v2').textContent = verb.v2;
  document.getElementById('fc-back-v3').textContent = verb.v3;
  document.getElementById('fc-back-cat').textContent = verb.cat;
  document.getElementById('fc-back-phonetics').textContent = `${verb.p1}  -  ${verb.p2}  -  ${verb.p3}`;
  
  const tipBox = document.getElementById('fc-back-tip');
  if (verb.tip) {
    tipBox.textContent = `💡 ${verb.tip}`;
    tipBox.classList.remove('hidden');
  } else {
    tipBox.classList.add('hidden');
  }

  // Actualitza botons Anterior/Següent
  document.getElementById('fc-btn-prev').disabled = state.game.fcIndex === 0;
  document.getElementById('fc-btn-next').disabled = state.game.fcIndex === verbs.length - 1;
}

function flipFlashcard() {
  const cardInner = document.getElementById('fc-card-inner');
  if (!cardInner) return;
  state.game.fcFlipped = !state.game.fcFlipped;
  cardInner.classList.toggle('is-flipped', state.game.fcFlipped);
  if (state.game.fcFlipped) {
    const verbs = VERBS_DATA.filter(v => v.pack === state.activePackId);
    const verb = verbs[state.game.fcIndex];
    if (verb) speakEnglish(`${verb.v1}. ${verb.v2}. ${verb.v3}.`);
  }
}

function nextFlashcard(delta) {
  const verbs = VERBS_DATA.filter(v => v.pack === state.activePackId);
  const newIdx = state.game.fcIndex + delta;
  if (newIdx >= 0 && newIdx < verbs.length) {
    state.game.fcIndex = newIdx;
    renderFlashcard(verbs);
  }
}

function playFcAudioCurrent() {
  const verbs = VERBS_DATA.filter(v => v.pack === state.activePackId);
  const verb = verbs[state.game.fcIndex];
  if (!verb) return;
  if (state.game.fcFlipped) {
    speakEnglish(`${verb.v1}, ${verb.v2}, ${verb.v3}`);
  } else {
    speakEnglish(verb.v1);
  }
}

// --- JOC 2: QUIZ 4 OPCIONS ---
function initQuiz(verbs) {
  state.game.quizQuestions = generateQuizQuestions(verbs);
  state.game.quizIndex = 0;
  state.game.quizScore = 0;
  state.game.quizStreak = 0;
  state.game.quizAnswered = false;
  renderQuizQuestion();
}

function generateQuizQuestions(verbs) {
  // Crea 10 preguntes intel·ligents a partir dels verbs del pack
  const allVerbs = VERBS_DATA;
  const questions = [];

  verbs.forEach(v => {
    // Tipus aleatori de pregunta
    const r = Math.random();
    let qType = 'v1_to_v2';
    let questionText = '';
    let correctAnswer = '';
    let distractors = [];

    if (r < 0.4) {
      // V1 -> V2
      qType = 'v1_to_v2';
      questionText = `Quin és el <strong>past simple (V2)</strong> del verb <em>"${v.v1}"</em>?`;
      correctAnswer = v.v2;
      distractors = allVerbs
        .filter(other => other.id !== v.id)
        .map(other => other.v2)
        .filter(ans => ans !== correctAnswer);
    } else if (r < 0.75) {
      // V1 -> V3
      qType = 'v1_to_v3';
      questionText = `Quin és el <strong>past participle (V3)</strong> del verb <em>"${v.v1}"</em>?`;
      correctAnswer = v.v3;
      distractors = allVerbs
        .filter(other => other.id !== v.id)
        .map(other => other.v3)
        .filter(ans => ans !== correctAnswer);
    } else {
      // Català -> V1/V2
      qType = 'cat_to_verb';
      questionText = `Quin verb significa <strong>"${v.cat}"</strong>?`;
      correctAnswer = `${v.v1} (${v.v2}, ${v.v3})`;
      distractors = allVerbs
        .filter(other => other.id !== v.id)
        .map(other => `${other.v1} (${other.v2}, ${other.v3})`);
    }

    // Barreja 3 distractors amb la resposta correcta
    const shuffledDistractors = shuffleArray([...new Set(distractors)]).slice(0, 3);
    const options = shuffleArray([correctAnswer, ...shuffledDistractors]);

    questions.push({
      verb: v,
      questionText,
      correctAnswer,
      options
    });
  });

  return shuffleArray(questions);
}

function renderQuizQuestion() {
  const q = state.game.quizQuestions[state.game.quizIndex];
  const container = document.getElementById('quiz-play-area');
  const resultsContainer = document.getElementById('quiz-results-area');
  
  if (!q) {
    // Fi del Quiz!
    container.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    finishQuiz();
    return;
  }

  container.classList.remove('hidden');
  resultsContainer.classList.add('hidden');
  state.game.quizAnswered = false;

  document.getElementById('quiz-progress').textContent = `Pregunta ${state.game.quizIndex + 1} de ${state.game.quizQuestions.length}`;
  document.getElementById('quiz-score-badge').textContent = `Encerts: ${state.game.quizScore}`;
  document.getElementById('quiz-streak-badge').textContent = `Ratxa: ${state.game.quizStreak} 🔥`;
  document.getElementById('quiz-question-title').innerHTML = q.questionText;

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "w-full p-4 text-left font-semibold text-slate-800 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border-2 border-slate-200 rounded-2xl transition-all flex items-center justify-between text-base active:scale-98";
    btn.innerHTML = `<span>${opt}</span><span class="quiz-opt-icon text-slate-300">○</span>`;
    btn.onclick = () => handleQuizAnswer(opt, btn, q);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('quiz-feedback-box').classList.add('hidden');
  document.getElementById('quiz-btn-next').classList.add('hidden');
}

function handleQuizAnswer(selectedOption, clickedBtn, q) {
  if (state.game.quizAnswered) return;
  state.game.quizAnswered = true;

  const isCorrect = selectedOption === q.correctAnswer;
  const optionsButtons = document.querySelectorAll('#quiz-options-container button');

  optionsButtons.forEach(btn => {
    btn.disabled = true;
    const text = btn.querySelector('span').textContent;
    if (text === q.correctAnswer) {
      btn.className = "w-full p-4 text-left font-bold text-emerald-900 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center justify-between text-base";
      btn.querySelector('.quiz-opt-icon').innerHTML = "✓";
      btn.querySelector('.quiz-opt-icon').className = "quiz-opt-icon text-emerald-700 font-bold";
    } else if (btn === clickedBtn && !isCorrect) {
      btn.className = "w-full p-4 text-left font-bold text-rose-900 bg-rose-100 border-2 border-rose-400 rounded-2xl flex items-center justify-between text-base";
      btn.querySelector('.quiz-opt-icon').innerHTML = "✕";
      btn.querySelector('.quiz-opt-icon').className = "quiz-opt-icon text-rose-700 font-bold";
    }
  });

  const feedbackBox = document.getElementById('quiz-feedback-box');
  const nextBtn = document.getElementById('quiz-btn-next');

  if (isCorrect) {
    state.game.quizScore++;
    state.game.quizStreak++;
    playSuccessSound();
    feedbackBox.className = "p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between";
    feedbackBox.innerHTML = `<span>🎉 Correcte! ${q.verb.v1} ➔ ${q.verb.v2} ➔ ${q.verb.v3} (${q.verb.cat})</span>`;
    speakEnglish(q.verb.v1);
  } else {
    state.game.quizStreak = 0;
    playErrorSound();
    feedbackBox.className = "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center justify-between";
    feedbackBox.innerHTML = `<span>⚠️ Errada! La resposta correcta és: <strong>${q.correctAnswer}</strong></span>`;
  }

  feedbackBox.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
}

function nextQuizQuestion() {
  state.game.quizIndex++;
  renderQuizQuestion();
}

function finishQuiz() {
  const total = state.game.quizQuestions.length;
  const score = state.game.quizScore;
  const pct = Math.round((score / total) * 100);

  let stars = 1;
  if (pct >= 90) stars = 3;
  else if (pct >= 70) stars = 2;

  // Guarda les estrelles si és millor puntuació
  const currentStars = state.userStats.packStars[state.activePackId] || 0;
  if (stars > currentStars) {
    state.userStats.packStars[state.activePackId] = stars;
    saveUserStats();
  }

  document.getElementById('quiz-final-score').textContent = `${score} / ${total}`;
  document.getElementById('quiz-final-pct').textContent = `${pct}% d'encert`;
  
  let starsDisplay = '';
  for (let i = 1; i <= 3; i++) {
    starsDisplay += i <= stars ? '⭐' : '☆';
  }
  document.getElementById('quiz-final-stars').textContent = starsDisplay;

  if (pct >= 80) {
    triggerConfetti();
    playFanfareSound();
  }
}

// --- JOC 3: ESCRIU LA FORMA QUE FALTA (FILL IN THE BLANKS) ---
function initTypeGame(verbs) {
  state.game.typeItems = shuffleArray([...verbs]);
  state.game.typeIndex = 0;
  state.game.typeScore = 0;
  renderTypeItem();
}

function renderTypeItem() {
  const verb = state.game.typeItems[state.game.typeIndex];
  const container = document.getElementById('type-play-area');
  const resultsContainer = document.getElementById('type-results-area');

  if (!verb) {
    container.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    document.getElementById('type-final-score').textContent = `${state.game.typeScore} / ${state.game.typeItems.length}`;
    if (state.game.typeScore >= state.game.typeItems.length * 0.8) triggerConfetti();
    return;
  }

  container.classList.remove('hidden');
  resultsContainer.classList.add('hidden');

  document.getElementById('type-counter').textContent = `Verb ${state.game.typeIndex + 1} de ${state.game.typeItems.length}`;
  document.getElementById('type-v1-label').textContent = verb.v1;
  document.getElementById('type-cat-label').textContent = verb.cat;
  
  const inV2 = document.getElementById('type-input-v2');
  const inV3 = document.getElementById('type-input-v3');
  inV2.value = '';
  inV3.value = '';
  inV2.className = 'w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 text-center text-lg focus:outline-none focus:border-indigo-500';
  inV3.className = 'w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 text-center text-lg focus:outline-none focus:border-indigo-500';

  document.getElementById('type-feedback').classList.add('hidden');
  document.getElementById('type-btn-check').classList.remove('hidden');
  document.getElementById('type-btn-next').classList.add('hidden');
  inV2.focus();
}

function checkTypeAnswer() {
  const verb = state.game.typeItems[state.game.typeIndex];
  const inV2 = document.getElementById('type-input-v2');
  const inV3 = document.getElementById('type-input-v3');

  const v2Ok = checkVerbMatch(inV2.value, verb.v2, verb.accept_v2);
  const v3Ok = checkVerbMatch(inV3.value, verb.v3, verb.accept_v3);

  inV2.className = `w-full px-4 py-3 border-2 rounded-xl font-bold text-center text-lg ${v2Ok ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-500 bg-rose-50 text-rose-800'}`;
  inV3.className = `w-full px-4 py-3 border-2 rounded-xl font-bold text-center text-lg ${v3Ok ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-500 bg-rose-50 text-rose-800'}`;

  const feedback = document.getElementById('type-feedback');
  feedback.classList.remove('hidden');

  if (v2Ok && v3Ok) {
    state.game.typeScore++;
    playSuccessSound();
    feedback.className = "p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-center text-sm";
    feedback.textContent = `Molt bé! ${verb.v1} ➔ ${verb.v2} ➔ ${verb.v3}`;
    speakEnglish(`${verb.v1}, ${verb.v2}, ${verb.v3}`);
  } else {
    playErrorSound();
    feedback.className = "p-3 rounded-xl bg-rose-100 text-rose-800 font-bold text-center text-sm";
    feedback.textContent = `Resposta esperada: past simple = "${verb.v2}", past participle = "${verb.v3}"`;
  }

  document.getElementById('type-btn-check').classList.add('hidden');
  document.getElementById('type-btn-next').classList.remove('hidden');
}

function nextTypeItem() {
  state.game.typeIndex++;
  renderTypeItem();
}

// --- JOC 4: CONNECTA PARELLES / MEMORY ---
function initMemoryGame(verbs) {
  // Triem 6 verbs aleatoris del pack per fer 12 cartes
  const selectedVerbs = shuffleArray([...verbs]).slice(0, 6);
  const cards = [];

  selectedVerbs.forEach(v => {
    // Carta A: V1 + Català
    cards.push({
      id: `v1-${v.id}`,
      matchId: v.id,
      text: v.v1,
      subtext: v.cat,
      type: 'v1'
    });
    // Carta B: V2 + V3
    cards.push({
      id: `v23-${v.id}`,
      matchId: v.id,
      text: `${v.v2} / ${v.v3}`,
      subtext: 'Past & Participle',
      type: 'v23'
    });
  });

  state.game.memoryCards = shuffleArray(cards);
  state.game.memoryFlippedCards = [];
  state.game.memoryMatchedCount = 0;
  state.game.memoryMoves = 0;
  state.game.memoryTimer = 0;

  if (state.game.memoryInterval) clearInterval(state.game.memoryInterval);
  state.game.memoryInterval = setInterval(() => {
    state.game.memoryTimer++;
    const timerEl = document.getElementById('memory-timer');
    if (timerEl) timerEl.textContent = `${state.game.memoryTimer}s`;
  }, 1000);

  renderMemoryGrid();
}

function renderMemoryGrid() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  grid.innerHTML = '';

  document.getElementById('memory-moves').textContent = `0 intents`;
  document.getElementById('memory-pairs').textContent = `0 / 6`;
  document.getElementById('memory-win-box').classList.add('hidden');

  state.game.memoryCards.forEach((card, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'memory-card w-full h-24 sm:h-28 rounded-2xl relative cursor-pointer select-none';
    cardEl.dataset.index = idx;
    cardEl.onclick = () => handleMemoryCardClick(idx, cardEl);

    cardEl.innerHTML = `
      <div class="memory-card-inner w-full h-full">
        <div class="memory-front bg-indigo-600 text-white font-bold text-xl border-2 border-indigo-700 shadow-md flex items-center justify-center">
          <span class="text-2xl opacity-80">❓</span>
        </div>
        <div class="memory-back bg-white border-2 border-indigo-200 text-slate-800 p-2 shadow-lg flex flex-col items-center justify-center text-center">
          <span class="font-display font-bold text-sm sm:text-base text-indigo-700 leading-tight">${card.text}</span>
          <span class="text-[11px] text-slate-500 font-medium mt-1 leading-none">${card.subtext}</span>
        </div>
      </div>
    `;
    grid.appendChild(cardEl);
  });
}

function handleMemoryCardClick(index, cardEl) {
  if (cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched')) return;
  if (state.game.memoryFlippedCards.length >= 2) return;

  const card = state.game.memoryCards[index];
  cardEl.classList.add('is-flipped');
  state.game.memoryFlippedCards.push({ index, card, el: cardEl });

  if (state.game.memoryFlippedCards.length === 2) {
    state.game.memoryMoves++;
    document.getElementById('memory-moves').textContent = `${state.game.memoryMoves} intents`;

    const [c1, c2] = state.game.memoryFlippedCards;
    if (c1.card.matchId === c2.card.matchId) {
      // Parella encertada!
      playSuccessSound();
      c1.el.classList.add('is-matched');
      c2.el.classList.add('is-matched');
      state.game.memoryMatchedCount++;
      document.getElementById('memory-pairs').textContent = `${state.game.memoryMatchedCount} / 6`;
      state.game.memoryFlippedCards = [];

      if (state.game.memoryMatchedCount === 6) {
        clearInterval(state.game.memoryInterval);
        playFanfareSound();
        triggerConfetti();
        document.getElementById('memory-win-box').classList.remove('hidden');
        document.getElementById('memory-win-time').textContent = `${state.game.memoryTimer}s`;
        document.getElementById('memory-win-moves').textContent = `${state.game.memoryMoves} intents`;
      }
    } else {
      // Parella fallada: torna a girar passats 900ms
      playErrorSound();
      setTimeout(() => {
        c1.el.classList.remove('is-flipped');
        c2.el.classList.remove('is-flipped');
        state.game.memoryFlippedCards = [];
      }, 900);
    }
  }
}

// --- JOC 5: LLETRES DESORDENADES (WORD SCRAMBLE) ---
function initScrambleGame(verbs) {
  state.game.scrambleItems = shuffleArray([...verbs]);
  state.game.scrambleIndex = 0;
  state.game.scrambleScore = 0;
  renderScrambleItem();
}

function renderScrambleItem() {
  const verb = state.game.scrambleItems[state.game.scrambleIndex];
  const container = document.getElementById('scramble-play-area');
  const resultsContainer = document.getElementById('scramble-results-area');

  if (!verb) {
    container.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    document.getElementById('scramble-final-score').textContent = `${state.game.scrambleScore} / ${state.game.scrambleItems.length}`;
    if (state.game.scrambleScore >= state.game.scrambleItems.length * 0.8) triggerConfetti();
    return;
  }

  container.classList.remove('hidden');
  resultsContainer.classList.add('hidden');

  // Triem si l'alumne ha d'ordenar V2 o V3
  const target = Math.random() > 0.5 ? verb.v2 : verb.v3;
  // Per a formes compostes com "burnt/burned" o "wake up", agafem la primera variant senzilla
  const cleanTarget = target.split('/')[0].trim().toLowerCase();
  
  state.game.scrambleTargetWord = cleanTarget;
  state.game.scrambleCurrentWord = '';
  state.game.scramblePickedLetters = [];

  document.getElementById('scramble-counter').textContent = `Verb ${state.game.scrambleIndex + 1} de ${state.game.scrambleItems.length}`;
  document.getElementById('scramble-v1').textContent = verb.v1;
  document.getElementById('scramble-cat').textContent = verb.cat;
  document.getElementById('scramble-type-badge').textContent = target === verb.v2 ? 'Ordena el past simple' : 'Ordena el past participle';

  // Lletres desordenades
  const letters = cleanTarget.replace(/\s+/g, '').split('');
  const scrambled = shuffleArray([...letters]);

  const pool = document.getElementById('scramble-letter-pool');
  pool.innerHTML = '';
  scrambled.forEach((char, i) => {
    const btn = document.createElement('button');
    btn.className = "w-11 h-12 rounded-xl bg-indigo-50 border-2 border-indigo-200 text-indigo-900 font-display font-bold text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95";
    btn.textContent = char;
    btn.onclick = () => pickScrambleLetter(char, btn);
    pool.appendChild(btn);
  });

  updateScrambleSlots();
  document.getElementById('scramble-feedback').classList.add('hidden');
  document.getElementById('scramble-btn-next').classList.add('hidden');
}

function pickScrambleLetter(char, btn) {
  state.game.scrambleCurrentWord += char;
  state.game.scramblePickedLetters.push({ char, btn });
  btn.disabled = true;
  btn.classList.add('opacity-30', 'cursor-not-allowed');
  updateScrambleSlots();

  // Si s'han omplert totes les lletres, comprova automàticament
  const targetWithoutSpaces = state.game.scrambleTargetWord.replace(/\s+/g, '');
  if (state.game.scrambleCurrentWord.length === targetWithoutSpaces.length) {
    checkScrambleAnswer();
  }
}

function undoScramble() {
  if (state.game.scramblePickedLetters.length === 0) return;
  const last = state.game.scramblePickedLetters.pop();
  last.btn.disabled = false;
  last.btn.classList.remove('opacity-30', 'cursor-not-allowed');
  state.game.scrambleCurrentWord = state.game.scrambleCurrentWord.slice(0, -1);
  updateScrambleSlots();
  document.getElementById('scramble-feedback').classList.add('hidden');
}

function updateScrambleSlots() {
  const display = document.getElementById('scramble-word-display');
  const targetLen = state.game.scrambleTargetWord.replace(/\s+/g, '').length;
  let html = '';
  for (let i = 0; i < targetLen; i++) {
    const letter = state.game.scrambleCurrentWord[i] || '';
    html += `<div class="w-10 h-12 border-b-4 border-indigo-500 font-display font-bold text-2xl flex items-center justify-center text-slate-800 ${letter ? 'bg-indigo-50/50' : 'bg-slate-100'}">${letter}</div>`;
  }
  display.innerHTML = html;
}

function checkScrambleAnswer() {
  const feedback = document.getElementById('scramble-feedback');
  feedback.classList.remove('hidden');

  const targetClean = state.game.scrambleTargetWord.replace(/\s+/g, '');
  if (state.game.scrambleCurrentWord === targetClean) {
    state.game.scrambleScore++;
    playSuccessSound();
    feedback.className = "p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-center text-sm";
    feedback.textContent = `Excel·lent! "${state.game.scrambleTargetWord}" és correcte!`;
    speakEnglish(state.game.scrambleTargetWord);
  } else {
    playErrorSound();
    feedback.className = "p-3 rounded-xl bg-rose-100 text-rose-800 font-bold text-center text-sm";
    feedback.textContent = `Ups! La paraula correcta és "${state.game.scrambleTargetWord}"`;
  }
  document.getElementById('scramble-btn-next').classList.remove('hidden');
}

function nextScrambleItem() {
  state.game.scrambleIndex++;
  renderScrambleItem();
}

// ==========================================
// 4. VISTA: CHECKPOINTS ACUMULATIUS (REPTES D'ACUMULACIÓ)
// ==========================================
function renderCheckpointsList() {
  const grid = document.getElementById('checkpoints-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CHECKPOINTS_META.forEach(cp => {
    const isUnlocked = isCheckpointUnlocked(cp.id);
    const hasBadge = !!state.userStats.checkpointBadges[cp.id];

    const card = document.createElement('div');
    card.className = `rounded-2xl p-6 border-2 transition-all relative flex flex-col justify-between ${
      isUnlocked 
        ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl' 
        : 'bg-slate-50 border-slate-200 opacity-60'
    }`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-3xl">${cp.badge}</span>
          ${hasBadge 
            ? `<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">🏅 Desbloquejat</span>` 
            : `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">${cp.requiredScore}% mínim</span>`
          }
        </div>
        <h3 class="font-display font-bold text-xl text-slate-900">${cp.title}</h3>
        <p class="text-xs font-bold text-indigo-600 mt-1">${cp.subtitle}</p>
        <p class="text-sm text-slate-600 mt-2 leading-relaxed">${cp.description}</p>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs text-slate-400 font-medium">Repte de 15 preguntes</span>
        <button onclick="navigateTo('checkpoint-game', { cpId: ${cp.id} })" 
          class="px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${
            hasBadge 
              ? 'bg-amber-500 hover:bg-amber-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }">
          ${hasBadge ? 'Repetir repte' : 'Començar repte'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function isCheckpointUnlocked(cpId) {
  // Checkpoints estan sempre disponibles o requereixen passar l'anterior
  if (cpId === 1) return true;
  return true; // En entorn escolar, permetem accés lliure perquè l'alumnat pugui triar el nivell que treballa a classe!
}

function startCheckpointGame() {
  const cp = CHECKPOINTS_META.find(c => c.id === state.activeCheckpointId) || CHECKPOINTS_META[0];
  document.getElementById('cp-game-title').textContent = cp.title;
  document.getElementById('cp-game-subtitle').textContent = `${cp.subtitle} - Objectiu: ${cp.requiredScore}% d'encerts`;

  // Filtra tots els verbs acumulats des del verb 1 fins a maxVerbs
  const accumulatedVerbs = VERBS_DATA.slice(0, cp.maxVerbs);

  // Genera 15 preguntes aleatòries combinades
  state.game.cpQuestions = generateCheckpointQuestions(accumulatedVerbs, 15);
  state.game.cpIndex = 0;
  state.game.cpScore = 0;

  renderCheckpointQuestion();
}

function generateCheckpointQuestions(verbs, count) {
  const selected = shuffleArray([...verbs]).slice(0, count);
  return selected.map(v => {
    const qType = Math.random() > 0.5 ? 'write_v2' : 'write_v3';
    return {
      verb: v,
      qType,
      question: qType === 'write_v2' 
        ? `Escriu el <strong>past simple (V2)</strong> de <em>"${v.v1}"</em>:` 
        : `Escriu el <strong>past participle (V3)</strong> de <em>"${v.v1}"</em>:`,
      expected: qType === 'write_v2' ? v.v2 : v.v3,
      accepted: qType === 'write_v2' ? v.accept_v2 : v.accept_v3
    };
  });
}

function renderCheckpointQuestion() {
  const q = state.game.cpQuestions[state.game.cpIndex];
  const container = document.getElementById('cp-play-area');
  const resultsContainer = document.getElementById('cp-results-area');

  if (!q) {
    container.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    finishCheckpoint();
    return;
  }

  container.classList.remove('hidden');
  resultsContainer.classList.add('hidden');

  document.getElementById('cp-progress').textContent = `Pregunta ${state.game.cpIndex + 1} de ${state.game.cpQuestions.length}`;
  document.getElementById('cp-score-badge').textContent = `Puntuació: ${state.game.cpScore}`;
  document.getElementById('cp-question-text').innerHTML = q.question;
  document.getElementById('cp-verb-cat').textContent = `Significat: "${q.verb.cat}"`;

  const input = document.getElementById('cp-answer-input');
  input.value = '';
  input.className = 'w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:outline-none focus:border-indigo-500';
  input.focus();

  document.getElementById('cp-feedback').classList.add('hidden');
  document.getElementById('cp-btn-check').classList.remove('hidden');
  document.getElementById('cp-btn-next').classList.add('hidden');
}

function checkCheckpointAnswer() {
  const q = state.game.cpQuestions[state.game.cpIndex];
  const input = document.getElementById('cp-answer-input');
  const isOk = checkVerbMatch(input.value, q.expected, q.accepted);

  const feedback = document.getElementById('cp-feedback');
  feedback.classList.remove('hidden');

  if (isOk) {
    state.game.cpScore++;
    playSuccessSound();
    input.className = 'w-full px-4 py-3 border-2 border-emerald-500 bg-emerald-50 text-emerald-800 rounded-xl font-bold text-center text-lg';
    feedback.className = "p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-center text-sm";
    feedback.textContent = `Molt bé! ${q.expected} és correcte!`;
    speakEnglish(q.verb.v1);
  } else {
    playErrorSound();
    input.className = 'w-full px-4 py-3 border-2 border-rose-500 bg-rose-50 text-rose-800 rounded-xl font-bold text-center text-lg';
    feedback.className = "p-3 rounded-xl bg-rose-100 text-rose-800 font-bold text-center text-sm";
    feedback.textContent = `Forma correcta: "${q.expected}" (${q.verb.v1} - ${q.verb.v2} - ${q.verb.v3})`;
  }

  document.getElementById('cp-btn-check').classList.add('hidden');
  document.getElementById('cp-btn-next').classList.remove('hidden');
}

function nextCheckpointQuestion() {
  state.game.cpIndex++;
  renderCheckpointQuestion();
}

function finishCheckpoint() {
  const cp = CHECKPOINTS_META.find(c => c.id === state.activeCheckpointId);
  const total = state.game.cpQuestions.length;
  const score = state.game.cpScore;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= cp.requiredScore;

  if (passed) {
    state.userStats.checkpointBadges[cp.id] = true;
    saveUserStats();
    triggerConfetti();
    playFanfareSound();
  }

  document.getElementById('cp-result-icon').textContent = passed ? cp.badge : '⏳';
  document.getElementById('cp-result-title').textContent = passed ? `Felicitats! Has superat el ${cp.title}!` : `Gairebé ho tens! Has obtingut un ${pct}%`;
  document.getElementById('cp-result-desc').textContent = passed 
    ? `Has aconseguit la insígnia "${cp.name}". Has demostrat un domini sòlid dels verbs acumulats!`
    : `Necessites com a mínim un ${cp.requiredScore}% d'encerts per desbloquejar la medalla. Torna-ho a provar!`;
  document.getElementById('cp-result-score').textContent = `${score} / ${total} (${pct}%)`;
}

// ==========================================
// 5. VISTA: ELS JOCS FINALS AMB TOTS ELS VERBS (108 VERBS)
// ==========================================
function renderAllVerbsHub() {
  const grid = document.getElementById('all-verbs-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ALL_VERBS_GAMES_META.forEach(g => {
    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group";
    card.onclick = () => {
      if (g.id === 'speedrun') navigateTo('game-speedrun');
      else if (g.id === 'survival') navigateTo('game-survival');
      else if (g.id === 'exam') navigateTo('game-exam');
      else if (g.id === 'wheel') navigateTo('game-wheel');
      else if (g.id === 'impostor') navigateTo('game-impostor');
      else if (g.id === 'trio-match') navigateTo('game-trio-match');
      else if (g.id === 'explorer') navigateTo('explorer');
    };

    let scoreBadge = '';
    if (g.id === 'speedrun' && state.userStats.speedrunHighScore) {
      scoreBadge = `<span class="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Rècord: ${state.userStats.speedrunHighScore} pts</span>`;
    } else if (g.id === 'survival' && state.userStats.survivalHighScore) {
      scoreBadge = `<span class="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">Rècord: ${state.userStats.survivalHighScore} seguits</span>`;
    } else if (g.id === 'impostor' && state.userStats.impostorHighScore) {
      scoreBadge = `<span class="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">Rècord: ${state.userStats.impostorHighScore} pts</span>`;
    } else if (g.id === 'trio-match' && state.userStats.trioMatchBestMoves) {
      scoreBadge = `<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Rècord: ${state.userStats.trioMatchBestMoves} intents</span>`;
    }

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${g.color} text-white flex items-center justify-center shadow-md shadow-indigo-500/10 border border-white/20">
            <i data-lucide="${g.icon || 'play'}" class="w-6 h-6"></i>
          </div>
          ${scoreBadge}
        </div>
        <h3 class="font-display font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">${g.title}</h3>
        <p class="text-xs font-bold text-indigo-600 mt-1">${g.subtitle}</p>
        <p class="text-sm text-slate-600 mt-2 leading-relaxed">${g.description}</p>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs font-semibold text-slate-400">108 verbs en joc</span>
        <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">Entrar al joc <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
      </div>
    `;
    grid.appendChild(card);
  });
  if (window.lucide) {
    lucide.createIcons();
  }
}

// --- JOC FINAL 1: CONTRARELLOTGE (SPEED RUSH) ---
function startSpeedrun() {
  state.game.speedTimer = 60;
  state.game.speedScore = 0;
  state.game.speedStreak = 0;
  
  document.getElementById('speed-play-area').classList.remove('hidden');
  document.getElementById('speed-results-area').classList.add('hidden');
  document.getElementById('speed-score').textContent = `0`;
  document.getElementById('speed-timer').textContent = `60s`;

  if (state.game.speedInterval) clearInterval(state.game.speedInterval);
  state.game.speedInterval = setInterval(() => {
    state.game.speedTimer--;
    const tEl = document.getElementById('speed-timer');
    if (tEl) tEl.textContent = `${state.game.speedTimer}s`;

    if (state.game.speedTimer <= 0) {
      clearInterval(state.game.speedInterval);
      finishSpeedrun();
    }
  }, 1000);

  nextSpeedQuestion();
}

function nextSpeedQuestion() {
  const randVerb = VERBS_DATA[Math.floor(Math.random() * VERBS_DATA.length)];
  const isV2 = Math.random() > 0.5;
  
  state.game.speedCurrentQ = {
    verb: randVerb,
    isV2,
    prompt: isV2 ? `Past simple (V2) de "${randVerb.v1}"?` : `Past participle (V3) de "${randVerb.v1}"?`,
    correct: isV2 ? randVerb.v2 : randVerb.v3
  };

  document.getElementById('speed-question-prompt').textContent = state.game.speedCurrentQ.prompt;
  document.getElementById('speed-verb-cat').textContent = `(${randVerb.cat})`;

  // 4 opcions ràpides
  const distractors = VERBS_DATA
    .filter(v => v.id !== randVerb.id)
    .map(v => isV2 ? v.v2 : v.v3)
    .filter(ans => ans !== state.game.speedCurrentQ.correct);

  const opts = shuffleArray([state.game.speedCurrentQ.correct, ...shuffleArray([...new Set(distractors)]).slice(0, 3)]);
  const container = document.getElementById('speed-options');
  container.innerHTML = '';

  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 font-bold text-slate-800 text-lg shadow-sm active:scale-95 transition-all";
    btn.textContent = opt;
    btn.onclick = () => handleSpeedAnswer(opt);
    container.appendChild(btn);
  });
}

function handleSpeedAnswer(selected) {
  if (state.game.speedTimer <= 0) return;
  const q = state.game.speedCurrentQ;

  if (selected === q.correct) {
    state.game.speedScore += 10 + (state.game.speedStreak * 2);
    state.game.speedStreak++;
    playSuccessSound();
  } else {
    state.game.speedStreak = 0;
    state.game.speedTimer = Math.max(0, state.game.speedTimer - 2); // penalització 2s
    playErrorSound();
  }

  document.getElementById('speed-score').textContent = `${state.game.speedScore}`;
  document.getElementById('speed-streak').textContent = `Ratxa: ${state.game.speedStreak} 🔥`;
  nextSpeedQuestion();
}

function finishSpeedrun() {
  document.getElementById('speed-play-area').classList.add('hidden');
  document.getElementById('speed-results-area').classList.remove('hidden');
  document.getElementById('speed-final-score').textContent = `${state.game.speedScore} punts`;

  if (state.game.speedScore > state.userStats.speedrunHighScore) {
    state.userStats.speedrunHighScore = state.game.speedScore;
    saveUserStats();
    document.getElementById('speed-record-notice').classList.remove('hidden');
    triggerConfetti();
  } else {
    document.getElementById('speed-record-notice').classList.add('hidden');
  }
}

// --- JOC FINAL 2: SUPERVIVÈNCIA (SURVIVAL - 3 VIDES) ---
function startSurvival() {
  state.game.survLives = 3;
  state.game.survScore = 0;
  state.game.survLifelines = { half: true, skip: true, hint: true };

  document.getElementById('surv-play-area').classList.remove('hidden');
  document.getElementById('surv-gameover-area').classList.add('hidden');
  updateSurvivalUI();
  nextSurvivalQuestion();
}

function updateSurvivalUI() {
  document.getElementById('surv-lives-display').textContent = '❤️'.repeat(state.game.survLives) + '🖤'.repeat(3 - state.game.survLives);
  document.getElementById('surv-score-display').textContent = `Encerts: ${state.game.survScore}`;
  
  // Botons comodins
  const bHalf = document.getElementById('surv-lifeline-half');
  const bSkip = document.getElementById('surv-lifeline-skip');
  const bHint = document.getElementById('surv-lifeline-hint');
  if (bHalf) bHalf.disabled = !state.game.survLifelines.half;
  if (bSkip) bSkip.disabled = !state.game.survLifelines.skip;
  if (bHint) bHint.disabled = !state.game.survLifelines.hint;
}

function nextSurvivalQuestion() {
  const randVerb = VERBS_DATA[Math.floor(Math.random() * VERBS_DATA.length)];
  const isV2 = Math.random() > 0.5;
  const correct = isV2 ? randVerb.v2 : randVerb.v3;

  state.game.survCurrentQ = {
    verb: randVerb,
    isV2,
    correct
  };

  document.getElementById('surv-question-title').innerHTML = `Quin és el <strong>${isV2 ? 'past simple (V2)' : 'past participle (V3)'}</strong> de:`;
  document.getElementById('surv-verb-v1').textContent = randVerb.v1;
  document.getElementById('surv-verb-cat').textContent = `(${randVerb.cat})`;

  const distractors = VERBS_DATA
    .filter(v => v.id !== randVerb.id)
    .map(v => isV2 ? v.v2 : v.v3)
    .filter(ans => ans !== correct);

  const opts = shuffleArray([correct, ...shuffleArray([...new Set(distractors)]).slice(0, 3)]);
  const container = document.getElementById('surv-options');
  container.innerHTML = '';

  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "surv-opt-btn p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-rose-400 font-bold text-slate-800 text-lg shadow-sm transition-all";
    btn.textContent = opt;
    btn.onclick = () => handleSurvivalAnswer(opt);
    container.appendChild(btn);
  });
}

function handleSurvivalAnswer(selected) {
  const q = state.game.survCurrentQ;
  if (selected === q.correct) {
    state.game.survScore++;
    playSuccessSound();
    speakEnglish(q.verb.v1);
    updateSurvivalUI();
    nextSurvivalQuestion();
  } else {
    state.game.survLives--;
    playErrorSound();
    updateSurvivalUI();
    if (state.game.survLives <= 0) {
      finishSurvival();
    } else {
      showNotification(`Has perdut una vida! La correcta era: ${q.correct}`, 'error');
      nextSurvivalQuestion();
    }
  }
}

function useSurvLifeline(type) {
  if (!state.game.survLifelines[type]) return;
  state.game.survLifelines[type] = false;
  updateSurvivalUI();

  if (type === 'half') {
    // Elimina 2 respostes falses
    const q = state.game.survCurrentQ;
    const btns = document.querySelectorAll('.surv-opt-btn');
    let removed = 0;
    btns.forEach(b => {
      if (b.textContent !== q.correct && removed < 2) {
        b.style.visibility = 'hidden';
        removed++;
      }
    });
  } else if (type === 'skip') {
    showNotification("Pregunta saltada!", "info");
    nextSurvivalQuestion();
  } else if (type === 'hint') {
    const q = state.game.survCurrentQ;
    showNotification(`Pista: comença amb la lletra "${q.correct[0]}"`, "info");
  }
}

function finishSurvival() {
  document.getElementById('surv-play-area').classList.add('hidden');
  document.getElementById('surv-gameover-area').classList.remove('hidden');
  document.getElementById('surv-final-score').textContent = `${state.game.survScore} verbs consecutius`;

  if (state.game.survScore > state.userStats.survivalHighScore) {
    state.userStats.survivalHighScore = state.game.survScore;
    saveUserStats();
    document.getElementById('surv-record-notice').classList.remove('hidden');
    triggerConfetti();
  } else {
    document.getElementById('surv-record-notice').classList.add('hidden');
  }
}

// --- JOC FINAL 3: SIMULACRE D'EXAMEN (AMB INFORME IMPRIMIBLE) ---
function setupExam(count = 20) {
  state.game.examVerbs = shuffleArray([...VERBS_DATA]).slice(0, count);
  state.game.examEvaluated = false;
  state.game.examGrade = 0;

  document.getElementById('exam-eval-summary').classList.add('hidden');
  document.getElementById('exam-btn-submit').classList.remove('hidden');

  const tableBody = document.getElementById('exam-table-body');
  tableBody.innerHTML = '';

  state.game.examRows = [];

  state.game.examVerbs.forEach((v, idx) => {
    // Decidim quina columna s'amaga (normalment s'omplen V2 i V3, o V1 i V3)
    const row = document.createElement('tr');
    row.className = "border-b border-slate-100 hover:bg-slate-50 transition-colors";

    row.innerHTML = `
      <td class="p-3 text-center text-xs font-bold text-slate-400">${idx + 1}</td>
      <td class="p-3 font-bold text-slate-800 text-sm">${v.v1}</td>
      <td class="p-3">
        <input type="text" id="exam-v2-${idx}" class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500" placeholder="Past Simple" autocomplete="off" />
      </td>
      <td class="p-3">
        <input type="text" id="exam-v3-${idx}" class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500" placeholder="Past Participle" autocomplete="off" />
      </td>
      <td class="p-3 text-sm text-slate-600 font-medium">${v.cat}</td>
      <td class="p-3 text-center" id="exam-status-${idx}">
        <span class="text-xs text-slate-300">Pendent</span>
      </td>
    `;
    tableBody.appendChild(row);

    state.game.examRows.push({ verb: v, idx });
  });
}

function evaluateExam() {
  if (state.game.examEvaluated) return;
  state.game.examEvaluated = true;

  let totalPoints = 0;
  const maxPoints = state.game.examRows.length * 2; // 1 punt per V2, 1 punt per V3

  state.game.examRows.forEach(row => {
    const v = row.verb;
    const inV2 = document.getElementById(`exam-v2-${row.idx}`);
    const inV3 = document.getElementById(`exam-v3-${row.idx}`);
    const statusCell = document.getElementById(`exam-status-${row.idx}`);

    const v2Ok = checkVerbMatch(inV2.value, v.v2, v.accept_v2);
    const v3Ok = checkVerbMatch(inV3.value, v.v3, v.accept_v3);

    if (v2Ok) {
      totalPoints++;
      inV2.classList.add('bg-emerald-50', 'border-emerald-400', 'text-emerald-800');
    } else {
      inV2.classList.add('bg-rose-50', 'border-rose-400', 'text-rose-800');
      inV2.title = `Esperat: ${v.v2}`;
    }

    if (v3Ok) {
      totalPoints++;
      inV3.classList.add('bg-emerald-50', 'border-emerald-400', 'text-emerald-800');
    } else {
      inV3.classList.add('bg-rose-50', 'border-rose-400', 'text-rose-800');
      inV3.title = `Esperat: ${v.v3}`;
    }

    inV2.disabled = true;
    inV3.disabled = true;

    if (v2Ok && v3Ok) {
      statusCell.innerHTML = `<span class="text-xs font-bold text-emerald-600">✓✓ 2/2</span>`;
    } else if (v2Ok || v3Ok) {
      statusCell.innerHTML = `<span class="text-xs font-bold text-amber-600">✓ 1/2</span>`;
    } else {
      statusCell.innerHTML = `<span class="text-xs font-bold text-rose-600">✕ 0/2</span>`;
    }
  });

  const grade = ((totalPoints / maxPoints) * 10).toFixed(1);
  state.game.examGrade = grade;
  state.userStats.examsCompleted++;
  saveUserStats();

  const summary = document.getElementById('exam-eval-summary');
  summary.classList.remove('hidden');
  document.getElementById('exam-grade-display').textContent = `${grade} / 10`;

  let verdict = '';
  if (grade >= 9) verdict = 'Excel·lent! Has dominat la llista completament!';
  else if (grade >= 7) verdict = 'Notable! Molt bona feina!';
  else if (grade >= 5) verdict = 'Aprovat! Cal repassar alguns participis.';
  else verdict = 'Insuficient. Et recomanem practicar amb els packs de 10.';

  document.getElementById('exam-verdict-display').textContent = verdict;
  document.getElementById('exam-btn-submit').classList.add('hidden');

  if (grade >= 8.5) {
    triggerConfetti();
    playFanfareSound();
  }
}

function openExamPrintModal() {
  const currentName = state.userStats.studentName || '';
  const currentGroup = state.userStats.studentGroup || '2n ESO';

  const nameInput = document.getElementById('modal-student-name');
  const groupInput = document.getElementById('modal-student-group');

  if (nameInput) {
    nameInput.value = currentName;
    nameInput.oninput = () => {
      const n = nameInput.value.trim() || "Alumne/a de 2n d'ESO";
      const g = (groupInput ? groupInput.value.trim() : '') || "2n ESO";
      updatePrintCertificate(n, g);
    };
  }

  if (groupInput) {
    groupInput.value = currentGroup;
    groupInput.oninput = () => {
      const n = (nameInput ? nameInput.value.trim() : '') || "Alumne/a de 2n d'ESO";
      const g = groupInput.value.trim() || "2n ESO";
      updatePrintCertificate(n, g);
    };
  }

  updatePrintCertificate(currentName || "Alumne/a de 2n d'ESO", currentGroup);

  const container = document.getElementById('examModalContainer');
  if (container) {
    container.classList.remove('hidden');
    container.scrollTop = 0;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function updatePrintCertificate(name, group) {
  const nameEl = document.getElementById('print-student-name');
  const groupEl = document.getElementById('print-student-group');
  const dateEl = document.getElementById('print-exam-date');
  const gradeEl = document.getElementById('print-exam-grade');
  const verdictEl = document.getElementById('print-exam-verdict');
  const countEl = document.getElementById('print-exam-count');
  const tableBody = document.getElementById('print-exam-table-body');

  if (nameEl) nameEl.textContent = name;
  if (groupEl) groupEl.textContent = group;
  if (dateEl) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    dateEl.textContent = `${day}/${month}/${year}`;
  }

  const grade = state.game.examGrade !== undefined ? state.game.examGrade : '0.0';
  if (gradeEl) gradeEl.textContent = `${grade} / 10`;

  if (verdictEl) {
    const num = parseFloat(grade);
    let vText = 'Insuficient';
    let vColor = 'text-rose-600';
    if (num >= 9) { vText = 'Excel·lent'; vColor = 'text-emerald-700'; }
    else if (num >= 7) { vText = 'Notable'; vColor = 'text-indigo-700'; }
    else if (num >= 6) { vText = 'Bé'; vColor = 'text-blue-700'; }
    else if (num >= 5) { vText = 'Suficient'; vColor = 'text-amber-700'; }
    verdictEl.textContent = `(${vText})`;
    verdictEl.className = `text-[10px] font-bold ${vColor}`;
  }

  const rows = state.game.examRows || [];
  if (countEl) countEl.textContent = `${rows.length} verbs avaluats`;

  if (tableBody) {
    tableBody.innerHTML = '';
    rows.forEach((row, i) => {
      const v = row.verb;
      const inV2 = document.getElementById(`exam-v2-${row.idx}`);
      const inV3 = document.getElementById(`exam-v3-${row.idx}`);
      const valV2 = (inV2 ? inV2.value.trim() : '') || '—';
      const valV3 = (inV3 ? inV3.value.trim() : '') || '—';
      const v2Ok = checkVerbMatch(valV2, v.v2, v.accept_v2);
      const v3Ok = checkVerbMatch(valV3, v.v3, v.accept_v3);

      const tr = document.createElement('tr');
      tr.className = "border-b border-slate-200 text-xs";
      tr.innerHTML = `
        <td class="py-1 px-2 text-center font-bold text-slate-500">${i + 1}</td>
        <td class="py-1 px-2 font-bold text-slate-900">${v.v1}</td>
        <td class="py-1 px-2 ${v2Ok ? 'text-emerald-700 font-semibold' : 'text-rose-700'}">
          ${valV2} ${v2Ok ? '✓' : `<span class="text-[10px] text-slate-500 font-normal">(${v.v2})</span>`}
        </td>
        <td class="py-1 px-2 ${v3Ok ? 'text-emerald-700 font-semibold' : 'text-rose-700'}">
          ${valV3} ${v3Ok ? '✓' : `<span class="text-[10px] text-slate-500 font-normal">(${v.v3})</span>`}
        </td>
        <td class="py-1 px-2 text-slate-600">${v.cat}</td>
        <td class="py-1 px-2 text-center font-bold ${v2Ok && v3Ok ? 'text-emerald-600' : (v2Ok || v3Ok ? 'text-amber-600' : 'text-rose-600')}">
          ${v2Ok && v3Ok ? '2/2' : (v2Ok || v3Ok ? '1/2' : '0/2')}
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }
}

function triggerExamPrint() {
  const nameInput = document.getElementById('modal-student-name');
  const groupInput = document.getElementById('modal-student-group');
  const name = (nameInput ? nameInput.value.trim() : '') || "Alumne/a de 2n d'ESO";
  const group = (groupInput ? groupInput.value.trim() : '') || "2n ESO";

  state.userStats.studentName = name;
  state.userStats.studentGroup = group;
  saveUserStats();

  updatePrintCertificate(name, group);

  // Executar impressió amb breu timeout
  setTimeout(() => {
    window.print();
  }, 100);
}

function closeExamPrintModal() {
  const container = document.getElementById('examModalContainer');
  if (container) {
    container.classList.add('hidden');
  }
}

// Assegurar dades actualitzades abans d'imprimir si s'activa des del menú del navegador (Ctrl+P)
window.addEventListener('beforeprint', () => {
  const nameInput = document.getElementById('modal-student-name');
  const groupInput = document.getElementById('modal-student-group');
  const name = (nameInput && nameInput.value.trim()) || state.userStats.studentName || "Alumne/a de 2n d'ESO";
  const group = (groupInput && groupInput.value.trim()) || state.userStats.studentGroup || "2n ESO";
  updatePrintCertificate(name, group);
  const container = document.getElementById('examModalContainer');
  if (container) {
    container.classList.remove('hidden');
  }
});

// --- JOC FINAL 4: LA RULETA DELS VERBS (LUCKY WHEEL) ---
function buildWheelPacks() {
  return Array.from({ length: 11 }, (_, index) => {
    const id = index + 1;
    const verbs = VERBS_DATA.filter(v => v.pack === id);
    return { id, verbs, count: verbs.length };
  });
}

function normalizeWheelAngle(angle) {
  const tau = Math.PI * 2;
  return ((angle % tau) + tau) % tau;
}

function setupWheel() {
  state.game.wheelAngle = normalizeWheelAngle(state.game.wheelAngle || 0);
  drawWheel();
}

function drawWheel() {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const radius = size / 2;
  const tau = Math.PI * 2;
  const wheelPacks = buildWheelPacks();
  const totalVerbs = VERBS_DATA.length;

  ctx.clearRect(0, 0, size, size);

  const colors = ['#4f46e5', '#4338ca', '#6366f1', '#3730a3'];

  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(state.game.wheelAngle);

  let cursor = 0;
  wheelPacks.forEach((pack, i) => {
    const arc = tau * (pack.count / totalVerbs);
    const start = cursor;
    const end = start + arc;
    const mid = start + arc / 2;
    const selected = !state.game.wheelSpinning && state.game.wheelSelectedVerb?.pack === pack.id;

    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius - 8, start, end);
    ctx.fill();
    ctx.strokeStyle = selected ? '#f59e0b' : '#ffffff';
    ctx.lineWidth = selected ? 6 : 3;
    ctx.stroke();

    ctx.save();
    ctx.rotate(mid);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Pack ${pack.id}`, radius - 25, 0);
    ctx.restore();

    cursor = end;
  });

  // El centre explica l'abast real de la selecció.
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, tau);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#312e81';
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('108', 0, -6);
  ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('VERBS', 0, 15);

  ctx.restore();
}

function spinWheel() {
  if (state.game.wheelSpinning) return;
  state.game.wheelSpinning = true;

  const spinBtn = document.getElementById('wheel-spin-btn');
  if (spinBtn) spinBtn.disabled = true;

  document.getElementById('wheel-result-card').classList.add('hidden');

  // Cada verb dels 108 té la mateixa probabilitat de ser seleccionat.
  const chosenVerb = VERBS_DATA[Math.floor(Math.random() * VERBS_DATA.length)];
  state.game.wheelSelectedVerb = chosenVerb;

  // La fletxa s'atura al sector del pack al qual pertany el verb escollit.
  const tau = Math.PI * 2;
  const wheelPacks = buildWheelPacks();
  const chosenPackIndex = wheelPacks.findIndex(pack => pack.id === chosenVerb.pack);
  const verbsBefore = wheelPacks
    .slice(0, chosenPackIndex)
    .reduce((total, pack) => total + pack.count, 0);
  const chosenPack = wheelPacks[chosenPackIndex];
  const sectorStart = tau * (verbsBefore / VERBS_DATA.length);
  const sectorArc = tau * (chosenPack.count / VERBS_DATA.length);
  const sectorMid = sectorStart + sectorArc / 2;
  const pointerAngle = -Math.PI / 2;

  const startAngle = state.game.wheelAngle;
  const desiredAngle = normalizeWheelAngle(pointerAngle - sectorMid);
  const deltaToTarget = normalizeWheelAngle(desiredAngle - normalizeWheelAngle(startAngle));
  const extraRotations = 5 + Math.floor(Math.random() * 3);
  const targetAngle = startAngle + extraRotations * tau + deltaToTarget;
  const startTime = performance.now();
  const duration = 3200;

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    state.game.wheelAngle = startAngle + (targetAngle - startAngle) * easeOut;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      state.game.wheelAngle = normalizeWheelAngle(targetAngle);
      state.game.wheelSpinning = false;
      drawWheel();
      if (spinBtn) spinBtn.disabled = false;
      revealWheelChallenge();
    }
  }

  requestAnimationFrame(animate);
}

function revealWheelChallenge() {
  const v = state.game.wheelSelectedVerb;
  if (!v) return;

  playFanfareSound();
  speakEnglish(v.v1);

  const card = document.getElementById('wheel-result-card');
  card.classList.remove('hidden');

  const packBadge = document.getElementById('wheel-res-pack');
  if (packBadge) packBadge.textContent = `Pack ${v.pack}`;

  document.getElementById('wheel-res-v1').textContent = v.v1;
  document.getElementById('wheel-res-cat').textContent = `Significat: ${v.cat}`;
  document.getElementById('wheel-res-v2').textContent = v.v2;
  document.getElementById('wheel-res-v3').textContent = v.v3;

  // Reptes orals o d'escriptura
  const challenges = [
    `🎯 Repte oral: fes una frase en <strong>past simple (V2)</strong> utilitzant "<em>${v.v2}</em>"!`,
    `⚡ Repte ràpid: pronuncia en veu alta les 3 formes (<strong>${v.v1} - ${v.v2} - ${v.v3}</strong>) sense equivocar-te!`,
    `✍️ Repte d'escriptura: escriu el past participle (V3) de "<em>${v.v1}</em>" a la teva llibreta!`,
    `🗣️ Repte de traducció: com es diu "ahir vaig ${v.cat.split(',')[0]}" en anglès?`
  ];
  const randChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  document.getElementById('wheel-res-challenge').innerHTML = randChallenge;
}

// ==========================================
// 5E. JOC FINAL: DETECTOR D'INTRUSOS
// ==========================================
function startImpostorGame() {
  const pool = shuffleArray([...IMPOSTORS_DATA]).slice(0, 10);

  state.game.impostorRounds = pool.map(item => {
    // Escollim 3 verbs diferents com a distractors genuïns
    const otherVerbs = shuffleArray(VERBS_DATA.filter(v => v.v1 !== item.v1)).slice(0, 3);
    const genuineOptions = otherVerbs.map(v => {
      const formChoice = Math.random() < 0.5 ? v.v2 : v.v3;
      const cleanForm = formChoice.split('/')[0].trim();
      return {
        text: cleanForm,
        isImpostor: false,
        v1: v.v1,
        cat: v.cat
      };
    });

    const impostorOption = {
      text: item.fake,
      isImpostor: true,
      v1: item.v1,
      cat: item.cat,
      correct: item.correct,
      explanation: item.explanation
    };

    const options = shuffleArray([...genuineOptions, impostorOption]);
    return {
      impostor: item,
      options
    };
  });

  state.game.impostorRoundIndex = 0;
  state.game.impostorScore = 0;
  state.game.impostorStreak = 0;
  state.game.impostorAnswered = false;

  document.getElementById('impostor-play-area').classList.remove('hidden');
  document.getElementById('impostor-results-area').classList.add('hidden');

  renderImpostorRound();
}

function renderImpostorRound() {
  const current = state.game.impostorRounds[state.game.impostorRoundIndex];
  if (!current) return;

  state.game.impostorAnswered = false;

  document.getElementById('impostor-round-display').textContent = `${state.game.impostorRoundIndex + 1} / 10`;
  document.getElementById('impostor-streak-display').textContent = `Ratxa: ${state.game.impostorStreak} 🔥`;
  document.getElementById('impostor-score-display').textContent = `${state.game.impostorScore}`;

  const feedbackBox = document.getElementById('impostor-feedback-box');
  feedbackBox.classList.add('hidden');
  feedbackBox.innerHTML = '';

  const nextBtn = document.getElementById('impostor-next-btn');
  nextBtn.classList.add('hidden');
  const nextBtnText = nextBtn.querySelector('span');
  if (nextBtnText) {
    nextBtnText.textContent = state.game.impostorRoundIndex === 9 ? "Veure resultats finals" : "Següent ronda";
  }

  const grid = document.getElementById('impostor-options-grid');
  grid.innerHTML = '';

  current.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = "impostor-opt-btn bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all font-display font-bold text-lg text-slate-800 text-center flex items-center justify-between shadow-xs cursor-pointer group";
    btn.onclick = () => checkImpostorAnswer(idx);
    btn.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 text-xs flex items-center justify-center font-mono">
          ${String.fromCharCode(65 + idx)}
        </span>
        <span class="text-base sm:text-lg font-bold">${opt.text}</span>
      </span>
      <span class="text-xs text-slate-400 group-hover:text-indigo-500 font-normal">Tria</span>
    `;
    grid.appendChild(btn);
  });
}

function checkImpostorAnswer(selectedIdx) {
  if (state.game.impostorAnswered) return;
  state.game.impostorAnswered = true;

  const current = state.game.impostorRounds[state.game.impostorRoundIndex];
  const selectedOpt = current.options[selectedIdx];
  const grid = document.getElementById('impostor-options-grid');
  const buttons = grid.querySelectorAll('.impostor-opt-btn');

  const feedbackBox = document.getElementById('impostor-feedback-box');
  feedbackBox.classList.remove('hidden');

  if (selectedOpt.isImpostor) {
    playSuccessSound();
    const roundPoints = 100 + (state.game.impostorStreak * 20);
    state.game.impostorScore += roundPoints;
    state.game.impostorStreak += 1;

    buttons[selectedIdx].className = "impostor-opt-btn bg-emerald-50 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 text-emerald-900 font-display font-bold text-lg text-center flex items-center justify-between shadow-sm";
    buttons[selectedIdx].innerHTML = `
      <span class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-800 text-xs flex items-center justify-center font-mono font-bold">✓</span>
        <span class="text-base sm:text-lg line-through decoration-rose-500 decoration-2">${selectedOpt.text}</span>
      </span>
      <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">+${roundPoints} pts</span>
    `;

    feedbackBox.className = "p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-950 text-sm space-y-1.5";
    feedbackBox.innerHTML = `
      <div class="font-bold flex items-center gap-2 text-emerald-800">
        <span>🎉 Ben detectat! "${selectedOpt.text}" és un intrús inventat.</span>
      </div>
      <p class="text-xs leading-relaxed text-emerald-900">
        <strong>Forma autèntica:</strong> la forma correcta és <em>${current.impostor.correct}</em> (${current.impostor.cat}).
      </p>
      <p class="text-xs text-emerald-800">${current.impostor.explanation}</p>
    `;
  } else {
    playErrorSound();
    state.game.impostorStreak = 0;

    buttons[selectedIdx].className = "impostor-opt-btn bg-rose-50 p-4 sm:p-5 rounded-2xl border-2 border-rose-400 text-rose-900 font-display font-bold text-lg text-center flex items-center justify-between shadow-sm";
    buttons[selectedIdx].innerHTML = `
      <span class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-rose-200 text-rose-800 text-xs flex items-center justify-center font-mono font-bold">✗</span>
        <span class="text-base sm:text-lg">${selectedOpt.text}</span>
      </span>
      <span class="text-xs font-semibold text-rose-600">Forma vàlida</span>
    `;

    current.options.forEach((opt, idx) => {
      if (opt.isImpostor) {
        buttons[idx].className = "impostor-opt-btn bg-amber-50 p-4 sm:p-5 rounded-2xl border-2 border-amber-400 text-amber-950 font-display font-bold text-lg text-center flex items-center justify-between shadow-sm";
        buttons[idx].innerHTML = `
          <span class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-amber-200 text-amber-800 text-xs flex items-center justify-center font-mono font-bold">🕵️</span>
            <span class="text-base sm:text-lg line-through decoration-rose-500 decoration-2">${opt.text}</span>
          </span>
          <span class="text-xs font-bold text-amber-700">Era aquí</span>
        `;
      }
    });

    feedbackBox.className = "p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-950 text-sm space-y-1.5";
    feedbackBox.innerHTML = `
      <div class="font-bold flex items-center gap-2 text-rose-800">
        <span>❌ "${selectedOpt.text}" sí que existeix i és correcta!</span>
      </div>
      <p class="text-xs leading-relaxed text-rose-900">
        <strong>L'intrús era:</strong> la forma inventada era <em>"${current.impostor.fake}"</em>. La forma correcta és <em>${current.impostor.correct}</em> (${current.impostor.cat}).
      </p>
      <p class="text-xs text-rose-800">${current.impostor.explanation}</p>
    `;
  }

  buttons.forEach(b => {
    b.onclick = null;
    b.classList.remove('cursor-pointer', 'hover:border-indigo-400', 'hover:bg-indigo-50/40');
  });

  document.getElementById('impostor-streak-display').textContent = `Ratxa: ${state.game.impostorStreak} 🔥`;
  document.getElementById('impostor-score-display').textContent = `${state.game.impostorScore}`;

  const nextBtn = document.getElementById('impostor-next-btn');
  nextBtn.classList.remove('hidden');
}

function nextImpostorRound() {
  state.game.impostorRoundIndex++;
  if (state.game.impostorRoundIndex >= 10) {
    finishImpostorGame();
  } else {
    renderImpostorRound();
  }
}

function finishImpostorGame() {
  document.getElementById('impostor-play-area').classList.add('hidden');
  const resultsArea = document.getElementById('impostor-results-area');
  resultsArea.classList.remove('hidden');

  document.getElementById('impostor-final-score').textContent = `${state.game.impostorScore} punts`;

  const recordNotice = document.getElementById('impostor-record-notice');
  const prevRecord = state.userStats.impostorHighScore || 0;
  if (state.game.impostorScore > prevRecord) {
    state.userStats.impostorHighScore = state.game.impostorScore;
    saveUserStats();
    recordNotice.classList.remove('hidden');
    triggerConfetti();
    playFanfareSound();
  } else {
    recordNotice.classList.add('hidden');
    if (state.game.impostorScore >= 700) {
      triggerConfetti();
      playFanfareSound();
    }
  }
}

// ==========================================
// 5F. JOC FINAL: TRENCACLOSQUES DE TRIOS
// ==========================================
function startTrioMatchGame() {
  if (state.game.trioInterval) clearInterval(state.game.trioInterval);

  const chosenVerbs = shuffleArray([...VERBS_DATA]).slice(0, 4);

  const rawCards = [];
  chosenVerbs.forEach(v => {
    const v2Clean = v.v2.split('/')[0].trim();
    const v3Clean = v.v3.split('/')[0].trim();

    rawCards.push({ verbId: v.id, formType: 'v1', text: v.v1, label: 'Infinitiu', cat: v.cat });
    rawCards.push({ verbId: v.id, formType: 'v2', text: v2Clean, label: 'Past simple', cat: v.cat });
    rawCards.push({ verbId: v.id, formType: 'v3', text: v3Clean, label: 'Past participle', cat: v.cat });
  });

  const shuffled = shuffleArray(rawCards);
  state.game.trioCards = shuffled.map((c, idx) => ({
    ...c,
    idx,
    matched: false,
    selected: false
  }));

  state.game.trioSelected = [];
  state.game.trioMatchedCount = 0;
  state.game.trioMoves = 0;
  state.game.trioTimer = 0;

  document.getElementById('trio-win-area').classList.add('hidden');
  document.getElementById('trio-cards-grid').classList.remove('hidden');
  document.getElementById('trio-selection-helper').classList.remove('hidden');
  document.getElementById('trio-selection-helper').textContent = "Fes clic a 3 formes del mateix verb (V1 + V2 + V3) per formar un trio.";

  updateTrioStatsUI();
  renderTrioCardsGrid();

  state.game.trioInterval = setInterval(() => {
    state.game.trioTimer++;
    const tEl = document.getElementById('trio-timer-display');
    if (tEl) tEl.textContent = `${state.game.trioTimer}s`;
  }, 1000);
}

function updateTrioStatsUI() {
  const movesEl = document.getElementById('trio-moves-display');
  const timerEl = document.getElementById('trio-timer-display');
  const matchedEl = document.getElementById('trio-matched-display');

  if (movesEl) movesEl.textContent = `${state.game.trioMoves} intents`;
  if (timerEl) timerEl.textContent = `${state.game.trioTimer}s`;
  if (matchedEl) matchedEl.textContent = `${state.game.trioMatchedCount} / 4`;
}

function renderTrioCardsGrid() {
  const grid = document.getElementById('trio-cards-grid');
  if (!grid) return;
  grid.innerHTML = '';

  state.game.trioCards.forEach((card, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = `trio-card-${idx}`;

    if (card.matched) {
      btn.className = "p-3 sm:p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 flex flex-col items-center justify-center text-center opacity-60 cursor-default shadow-xs";
      btn.innerHTML = `
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600">${card.label}</span>
        <span class="font-display font-extrabold text-base sm:text-lg text-emerald-900 mt-0.5">${card.text}</span>
        <span class="text-[11px] text-emerald-700 mt-1 font-semibold">✓ Completat</span>
      `;
    } else {
      const isSelected = state.game.trioSelected.includes(idx);
      const bg = isSelected
        ? "bg-indigo-600 border-indigo-700 text-white shadow-md scale-[1.02]"
        : "bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/30 shadow-xs";

      btn.className = `p-3 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${bg}`;
      btn.onclick = () => handleTrioCardClick(idx);
      btn.innerHTML = `
        <span class="text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-400'}">${card.label}</span>
        <span class="font-display font-extrabold text-base sm:text-lg mt-0.5">${card.text}</span>
        <span class="text-[11px] ${isSelected ? 'text-indigo-200' : 'text-slate-500'} mt-1 truncate max-w-full">${card.cat}</span>
      `;
    }

    grid.appendChild(btn);
  });
}

function handleTrioCardClick(idx) {
  const card = state.game.trioCards[idx];
  if (!card || card.matched) return;

  if (state.game.trioSelected.includes(idx)) {
    state.game.trioSelected = state.game.trioSelected.filter(i => i !== idx);
    renderTrioCardsGrid();
    speakEnglish(card.text);
    return;
  }

  if (state.game.trioSelected.length >= 3) return;

  state.game.trioSelected.push(idx);
  speakEnglish(card.text);
  renderTrioCardsGrid();

  const helper = document.getElementById('trio-selection-helper');
  if (state.game.trioSelected.length === 1) {
    helper.textContent = "Has triat 1 forma. Selecciona'n dues més del mateix verb.";
  } else if (state.game.trioSelected.length === 2) {
    helper.textContent = "Molt bé! Ara tria l'última forma del mateix verb.";
  } else if (state.game.trioSelected.length === 3) {
    helper.textContent = "Comprovant el trio...";
    checkTrioSelection();
  }
}

function checkTrioSelection() {
  state.game.trioMoves++;
  updateTrioStatsUI();

  const [i1, i2, i3] = state.game.trioSelected;
  const c1 = state.game.trioCards[i1];
  const c2 = state.game.trioCards[i2];
  const c3 = state.game.trioCards[i3];

  const helper = document.getElementById('trio-selection-helper');

  const isMatch = (c1.verbId === c2.verbId && c2.verbId === c3.verbId);

  if (isMatch) {
    playSuccessSound();
    c1.matched = true;
    c2.matched = true;
    c3.matched = true;
    state.game.trioMatchedCount++;
    state.game.trioSelected = [];

    updateTrioStatsUI();
    renderTrioCardsGrid();

    helper.innerHTML = `<span class="text-emerald-700 font-bold">🎉 Trio completat! ${c1.text} - ${c2.text} - ${c3.text} (${c1.cat})</span>`;

    if (state.game.trioMatchedCount >= 4) {
      setTimeout(() => finishTrioMatchGame(), 600);
    }
  } else {
    playErrorSound();
    [i1, i2, i3].forEach(idx => {
      const btn = document.getElementById(`trio-card-${idx}`);
      if (btn) {
        btn.classList.remove('bg-indigo-600', 'border-indigo-700');
        btn.classList.add('bg-rose-500', 'border-rose-600', 'text-white');
      }
    });

    helper.innerHTML = `<span class="text-rose-600 font-bold">❌ Aquestes 3 formes no són del mateix verb. Torna-ho a provar!</span>`;

    setTimeout(() => {
      state.game.trioSelected = [];
      renderTrioCardsGrid();
      helper.textContent = "Fes clic a 3 formes del mateix verb (V1 + V2 + V3) per formar un trio.";
    }, 900);
  }
}

function finishTrioMatchGame() {
  if (state.game.trioInterval) clearInterval(state.game.trioInterval);

  triggerConfetti();
  playFanfareSound();

  document.getElementById('trio-cards-grid').classList.add('hidden');
  document.getElementById('trio-selection-helper').classList.add('hidden');
  const winArea = document.getElementById('trio-win-area');
  winArea.classList.remove('hidden');

  document.getElementById('trio-win-moves').textContent = `${state.game.trioMoves} intents`;
  document.getElementById('trio-win-time').textContent = `${state.game.trioTimer} segons`;

  const recordNotice = document.getElementById('trio-record-notice');
  const prevBest = state.userStats.trioMatchBestMoves || 0;
  const isNewRecord = prevBest === 0 || state.game.trioMoves < prevBest;

  if (isNewRecord) {
    state.userStats.trioMatchBestMoves = state.game.trioMoves;
    saveUserStats();
    recordNotice.classList.remove('hidden');
  } else {
    recordNotice.classList.add('hidden');
  }
}

// ==========================================
// 6. VISTA: EXPLORADOR & CERCADOR DELS 108 VERBS
// ==========================================
let currentExplorerFilter = 'all';

function renderExplorer() {
  filterExplorer(currentExplorerFilter);
}

function filterExplorer(filterType) {
  currentExplorerFilter = filterType;
  
  // Actualitza botons de filtre
  document.querySelectorAll('.explorer-filter-btn').forEach(btn => {
    if (btn.dataset.filter === filterType) {
      btn.className = 'explorer-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-sm';
    } else {
      btn.className = 'explorer-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200';
    }
  });

  const query = cleanInput(document.getElementById('explorer-search-input')?.value || '');
  const tbody = document.getElementById('explorer-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  let filtered = VERBS_DATA;

  // Filtres per família
  if (filterType === 'no-change') {
    filtered = filtered.filter(v => v.family === 'no-change');
  } else if (filterType === 'ought') {
    filtered = filtered.filter(v => v.family === 'ought-aught');
  } else if (filterType === 'iau') {
    filtered = filtered.filter(v => v.family === 'i-a-u');
  } else if (filterType === 'ow-ew') {
    filtered = filtered.filter(v => v.family === 'ow-ew-own');
  } else if (filterType === 'end-t') {
    filtered = filtered.filter(v => v.family === 'd-to-t' || v.family === 'ee-to-e');
  }

  // Cerca per text
  if (query) {
    filtered = filtered.filter(v => 
      cleanInput(v.v1).includes(query) ||
      cleanInput(v.v2).includes(query) ||
      cleanInput(v.v3).includes(query) ||
      cleanInput(v.cat).includes(query)
    );
  }

  document.getElementById('explorer-count').textContent = `Mostrant ${filtered.length} de 108 verbs`;

  filtered.forEach(v => {
    const tr = document.createElement('tr');
    tr.className = "border-b border-slate-100 hover:bg-indigo-50/40 transition-colors group";

    tr.innerHTML = `
      <td class="p-3 text-center text-xs font-bold text-slate-400">${v.id}</td>
      <td class="p-3">
        <div class="flex items-center gap-2">
          <button onclick="speakEnglish('${v.v1}')" class="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100" title="Escoltar">
            🔊
          </button>
          <div>
            <span class="font-display font-bold text-slate-900">${v.v1}</span>
            <span class="text-[11px] text-slate-400 ml-1">${v.p1 || ''}</span>
          </div>
        </div>
      </td>
      <td class="p-3 font-semibold text-slate-700">
        <span>${v.v2}</span>
        <span class="text-[11px] text-slate-400 ml-1">${v.p2 || ''}</span>
      </td>
      <td class="p-3 font-semibold text-slate-700">
        <span>${v.v3}</span>
        <span class="text-[11px] text-slate-400 ml-1">${v.p3 || ''}</span>
      </td>
      <td class="p-3 text-sm text-slate-600">${v.cat}</td>
      <td class="p-3 text-center">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">Pack ${v.pack}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- UTILITAT: BARREJA D'ARRAYS (Fisher-Yates) ---
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- GESTIÓ D'ENLLAÇOS AMB HASH (#finals) ---
function handleHashNavigation() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#finals' || hash === '#all-verbs' || hash === '#jocs-finals') {
    navigateTo('all-verbs-hub');
    return true;
  }
  return false;
}

// --- INICIALITZACIÓ GLOBAL AL CARREGAR EL DOCUMENT ---
document.addEventListener('DOMContentLoaded', () => {
  loadUserStats();

  if (!handleHashNavigation()) {
    navigateTo('home');
  }

  window.addEventListener('hashchange', () => {
    handleHashNavigation();
  });

  // Listener per al cercador de l'explorador
  const searchInp = document.getElementById('explorer-search-input');
  if (searchInp) {
    searchInp.addEventListener('input', () => filterExplorer(currentExplorerFilter));
  }
});
