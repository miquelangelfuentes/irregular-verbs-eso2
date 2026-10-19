from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def read(name):
    return (ROOT / name).read_text(encoding='utf-8')


def write(name, text):
    (ROOT / name).write_text(text, encoding='utf-8')


# -----------------------------------------------------------------------------
# INDEX.HTML
# -----------------------------------------------------------------------------
html = read('index.html')

html = html.replace('styles.css?v=3.1', 'styles.css?v=4.0')
html = html.replace('verbs-data.js?v=3.1', 'verbs-data.js?v=4.0')
html = html.replace('app.js?v=3.1', 'app.js?v=4.0')

html = html.replace('>Packs de 10</button>', '>Packs d\'aprenentatge</button>')

nav_checkpoint = '''<button onclick="navigateTo('checkpoints-list')" class="px-3 py-1.5 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors">Checkpoints</button>'''
if 'Repàs d\'errors</button>' not in html and nav_checkpoint in html:
    html = html.replace(
        nav_checkpoint,
        nav_checkpoint + '''\n        <button onclick="navigateTo('review-errors')" class="px-3 py-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors">Repàs d'errors</button>'''
    )

html = html.replace(
    "Aprèn pas a pas en packs de 10 alfabèticament, consolida la memòria amb els checkpoints acumulatius i enfronta't als jocs finals amb tots els verbs.",
    "Aprèn els 108 verbs en 11 packs d'aprenentatge, recupera'ls sense mirar la resposta i posa't a prova amb repassos acumulatius. El teu progrés i els verbs que et costen més es desen només en aquest navegador."
)

hero_buttons = '''<!-- Botons crida a l'acció -->
          <div class="pt-2 flex flex-wrap gap-3">
            <button onclick="navigateTo('packs-list')" class="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-display font-bold text-sm shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 active:scale-95">
              <span>Aprèn i practica</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
            <button onclick="navigateTo('checkpoints-list')" class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2">
              <i data-lucide="flag" class="w-4 h-4 text-pink-300"></i>
              <span>Posa't a prova</span>
            </button>
          </div>'''
html = re.sub(
    r'<!-- Botons crida a l\'acció -->\s*<div class="pt-2 flex flex-wrap gap-3">.*?</div>(?=\s*</div>\s*\n\s*<!-- Barra de progrés global -->)',
    hero_buttons,
    html,
    count=1,
    flags=re.S,
)

routes_section = '''<!-- Dues rutes principals -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <i data-lucide="graduation-cap" class="w-6 h-6"></i>
          </div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Ruta d'aprenentatge</span>
          <h3 class="font-display font-bold text-2xl text-slate-900 mt-1">Aprèn i practica</h3>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Treballa els verbs en 11 packs ordenats alfabèticament. Els 10 primers contenen 10 verbs i el pack final en conté 8. Combina reconeixement amb producció escrita abans de considerar un pack dominat.
          </p>
          <div class="flex flex-wrap gap-2 mt-5">
            <button onclick="navigateTo('packs-list')" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">Obrir els packs</button>
            <button onclick="navigateTo('review-errors')" class="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-sm">Repassar els meus errors</button>
          </div>
        </section>

        <section class="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <i data-lucide="target" class="w-6 h-6"></i>
          </div>
          <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Ruta d'autoavaluació</span>
          <h3 class="font-display font-bold text-2xl text-slate-900 mt-1">Posa't a prova</h3>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Recupera verbs de packs anteriors amb checkpoints acumulatius. Quan vulguis treballar amb els 108 verbs, passa als jocs finals i al simulacre d'examen.
          </p>
          <div class="flex flex-wrap gap-2 mt-5">
            <button onclick="navigateTo('checkpoints-list')" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm">Obrir checkpoints</button>
            <button onclick="navigateTo('all-verbs-hub')" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-sm">Jocs amb els 108 verbs</button>
          </div>
        </section>
      </div>

      '''
html = re.sub(
    r'<!-- Els 3 Pilars de Pràctica -->.*?(?=<!-- Accés ràpid al diccionari -->)',
    routes_section,
    html,
    count=1,
    flags=re.S,
)

review_view = '''
    <!-- ============================================== -->
    <!-- VISTA: REPÀS ADAPTATIU DELS ERRORS            -->
    <!-- ============================================== -->
    <section id="view-review-errors" class="view-screen hidden space-y-6" aria-labelledby="review-errors-title">
      <div class="flex items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-rose-600">Pràctica personalitzada</span>
          <h1 id="review-errors-title" class="font-display font-bold text-3xl text-slate-900 mt-1">Repàs dels meus errors</h1>
        </div>
        <button onclick="navigateTo('home')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm">Tornar a l'inici</button>
      </div>
      <div id="review-errors-content"></div>
    </section>

'''
if 'id="view-review-errors"' not in html:
    explorer_match = re.search(r'\s*<section id="view-explorer"', html)
    if explorer_match:
        html = html[:explorer_match.start()] + '\n' + review_view + html[explorer_match.start():]

html = html.replace(
    'title="Activa / desactiva efectes sonors">',
    'title="Activa / desactiva efectes sonors" aria-label="Activa o desactiva els efectes sonors">'
)

if 'enhancements.js?v=4.0' not in html:
    html = html.replace(
        '<script src="app.js?v=4.0"></script>',
        '<script src="app.js?v=4.0"></script>\n  <script src="enhancements.js?v=4.0"></script>'
    )

write('index.html', html)


# -----------------------------------------------------------------------------
# VERBS-DATA.JS
# -----------------------------------------------------------------------------
data = read('verbs-data.js')
data = data.replace(
'''    v1: "hang", v2: "hung/hanged", v3: "hung/hanged",
    cat: "penjar",
    p1: "/hæŋ/", p2: "/hʌŋ//hæŋd/", p3: "/hʌŋ//hæŋd/",
    accept_v2: ["hung", "hanged", "hung/hanged"],
    accept_v3: ["hung", "hanged", "hung/hanged"],
    family: "t-or-ed"''',
'''    v1: "hang", v2: "hung", v3: "hung",
    cat: "penjar",
    p1: "/hæŋ/", p2: "/hʌŋ/", p3: "/hʌŋ/",
    accept_v2: ["hung"],
    accept_v3: ["hung"],
    family: "especial", tip: "Per penjar objectes fem servir hang-hung-hung. Hanged s'utilitza sobretot quan hang significa executar una persona per penjament."'''
)
data = data.replace(
'    accept_v2: ["woke up", "woke"],\n    accept_v3: ["woken up", "woken"],',
'    accept_v2: ["woke up"],\n    accept_v3: ["woken up"],'
)
write('verbs-data.js', data)


# -----------------------------------------------------------------------------
# STYLES.CSS
# -----------------------------------------------------------------------------
css = read('styles.css')
addition = '''

/* Accessibilitat de teclat i moviment reduït */
:focus-visible {
  outline: 3px solid #4f46e5;
  outline-offset: 3px;
}

[role="button"]:focus-visible {
  border-radius: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .card-inner,
  .memory-card-inner {
    transition: none !important;
  }
}
'''
if 'Accessibilitat de teclat i moviment reduït' not in css:
    css += addition
write('styles.css', css)


# -----------------------------------------------------------------------------
# README.MD
# -----------------------------------------------------------------------------
readme = read('README.md')
readme = readme.replace(
    "L'aprenentatge està dissenyat seguint els principis de la bastida d'aprenentatge (*scaffolding*) i la repetició espaiada acumulativa (*spaced retrieval*):",
    "L'aprenentatge combina bastides de suport amb pràctica de recuperació acumulativa. Els checkpoints recuperen verbs de packs anteriors, però l'aplicació no programa els repassos segons intervals temporals, de manera que no es presenta com un sistema de repetició espaiada."
)
readme = readme.replace(
    '│ 1. PACKS DE 10 ALFABÈTICAMENT (11 nivells de 10 verbs)      │',
    '│ 1. PACKS D’APRENENTATGE (10 packs de 10 + un pack de 8)    │'
)
readme = readme.replace('## 📦 Detall dels 11 packs de 10', '## 📦 Detall dels 11 packs d’aprenentatge')
readme = readme.replace('## 🎮 Els 5 jocs dins de cada pack', '## 🎮 Activitats dins de cada pack')

adaptive_section = '''
## 🧠 Repàs dels meus errors

L'aplicació registra localment els verbs en què l'alumnat s'equivoca i crea una cua de repàs personalitzada. Els verbs amb més dificultat apareixen primer i es practiquen mitjançant recuperació escrita de V2 i V3. Aquest historial es desa només al navegador mitjançant `localStorage`.

El domini d'un pack ja no depèn només del reconeixement en un quiz. Per obtenir dues estrelles, cal arribar com a mínim al **80% tant al quiz com a l'activitat escrita**. Les tres estrelles exigeixen com a mínim un **90% en totes dues evidències**.

---

'''
if '## 🧠 Repàs dels meus errors' not in readme:
    readme = readme.replace('## 🚩 Checkpoints acumulatius', adaptive_section + '## 🚩 Checkpoints acumulatius')

readme = readme.replace(
    '- El sistema desa el progrés i les medalles obtingudes a `localStorage`.',
    '- El sistema desa el progrés, les medalles, les puntuacions de quiz i producció escrita i l’historial d’errors a `localStorage`.'
)
readme = readme.replace(
    '- **📚 Diccionari i cercador:** cercador en temps real per anglès o català, amb text a veu en anglès i filtres per famílies (*no-change*, *-ought/-aught*, *i-a-u*, etc.).',
    '- **📚 Diccionari i cercador:** cercador en temps real per anglès o català, amb text a veu en anglès i filtres per famílies (*no-change*, *-ought/-aught*, *i-a-u*, etc.).\n- **Navegació compartible:** les vistes principals utilitzen fragments d’URL (`#packs`, `#review`, `#dictionary`, etc.) perquè es puguin enllaçar directament i el botó Enrere del navegador funcioni de manera coherent.'
)
write('README.md', readme)

print('Verb Quest improvements applied successfully.')
