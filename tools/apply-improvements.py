from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]

TAILWIND_CDN_RE = re.compile(r'\s*<script\s+src=["\']https://cdn\.tailwindcss\.com["\']></script>\s*', re.I)
TAILWIND_CONFIG_RE = re.compile(r'\s*<script>\s*tailwind\.config\s*=.*?</script>\s*', re.I | re.S)


WHEEL_JS = r'''// --- JOC FINAL 4: LA RULETA DELS VERBS (LUCKY WHEEL) ---
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
'''


def ensure_tailwind_config() -> None:
    config = ROOT / 'tailwind.config.cjs'
    if config.exists():
        return

    node_script = r'''
const fs = require('fs');
const vm = require('vm');

function merge(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] ??= {};
      merge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

const extend = {};
let found = false;
for (const file of fs.readdirSync('.').filter(name => name.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    const code = match[1];
    if (!code.includes('tailwind.config')) continue;
    const sandbox = { tailwind: {} };
    vm.runInNewContext(code, sandbox, { filename: file });
    merge(extend, sandbox.tailwind?.config?.theme?.extend || {});
    found = true;
  }
}
if (!found) throw new Error('No s’ha trobat cap configuració Tailwind per migrar.');

const out = `module.exports = {
  content: ['./*.html', './*.js'],
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(slate|indigo|emerald|amber|rose|sky|purple|pink|blue|orange|red|green|brand)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ['hover', 'focus']
    }
  ],
  theme: { extend: ${JSON.stringify(extend, null, 2)} }
};\n`;
fs.writeFileSync('tailwind.config.cjs', out);
'''
    subprocess.run(['node', '-e', node_script], cwd=ROOT, check=True)


def build_tailwind() -> None:
    ensure_tailwind_config()
    src = ROOT / 'src'
    src.mkdir(exist_ok=True)
    (src / 'tailwind-input.css').write_text(
        '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n',
        encoding='utf-8',
    )
    subprocess.run(
        [
            'npx', '--yes', 'tailwindcss@3.4.17',
            '-c', 'tailwind.config.cjs',
            '-i', 'src/tailwind-input.css',
            '-o', 'tailwind.css',
            '--minify',
        ],
        cwd=ROOT,
        check=True,
    )


def migrate_tailwind(html: str) -> str:
    html = TAILWIND_CDN_RE.sub('\n', html)
    html = TAILWIND_CONFIG_RE.sub('\n', html)
    html = html.replace('<!-- Tailwind CSS -->', '<!-- CSS de producció -->')
    link = '<link rel="stylesheet" href="tailwind.css?v=1.0">'
    if link not in html:
        html = html.replace(
            '<link rel="stylesheet" href="styles.css?v=4.0" />',
            f'{link}\n  <link rel="stylesheet" href="styles.css?v=4.0" />',
            1,
        )
    return html


def polish_index(html: str) -> str:
    html = migrate_tailwind(html)
    html = html.replace(
        "Aprèn els 108 verbs en 11 packs d'aprenentatge, recupera'ls sense mirar la resposta i posa't a prova amb repassos acumulatius. El teu progrés i els verbs que et costen més es desen només en aquest navegador.",
        "Treballa els 108 verbs en 11 packs d'aprenentatge i recupera'ls sense mirar la resposta. Després posa't a prova amb repassos acumulatius. El teu progrés i els verbs que et costen més es desen només en aquest navegador.",
    )
    html = html.replace(
        'Aprèn i consolida els 108 verbs en 11 blocs progressius de 10 verbs.',
        'Aprèn i consolida els 108 verbs en 11 packs d’aprenentatge - 10 packs de 10 verbs i un últim de 8.',
    )
    html = html.replace('11 nivells de 10 verbs', '10 packs de 10 verbs i un últim pack de 8')
    html = html.replace('11 packs de 10 alfabèticament', '11 packs d’aprenentatge')
    html = html.replace('<!-- 2. VISTA: LLISTA DE PACKS DE 10 -->', '<!-- 2. VISTA: LLISTA DE PACKS D’APRENENTATGE -->')
    html = html.replace('>Packs de 10 verbs alfabèticament</h2>', '>Packs d’aprenentatge</h2>')

    # El menú principal comparteix el mateix comportament visual a tots els botons.
    html = html.replace(
        'hover:text-rose-600 hover:bg-rose-50 transition-colors">Repàs d\'errors</button>',
        'hover:text-indigo-600 hover:bg-slate-100 transition-colors">Repàs d\'errors</button>',
    )

    # La ruleta representa els packs, no una mostra enganyosa de verbs.
    html = html.replace(
        "Gira la ruleta per triar un verb a l'atzar i superar el repte a classe o individualment!",
        "La ruleta representa els 11 packs. Cada gir pot seleccionar qualsevol dels 108 verbs de la llista.",
    )
    if '11 packs - 108 verbs possibles' not in html:
        html = html.replace(
            '        <div class="wheel-container">',
            '''        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <i data-lucide="shuffle" class="w-4 h-4"></i>
          <span>11 packs - 108 verbs possibles</span>
        </div>

        <div class="wheel-container">''',
            1,
        )
    html = html.replace(
        '<canvas id="wheel-canvas" width="380" height="380" class="w-full h-full"></canvas>',
        '<canvas id="wheel-canvas" width="380" height="380" class="w-full h-full" role="img" aria-label="Ruleta amb 11 sectors, un per cada pack dels 108 verbs irregulars"></canvas>',
    )
    if 'id="wheel-res-pack"' not in html:
        html = html.replace(
            '''          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">Verb seleccionat</span>
            <button onclick="speakEnglish(state.game.wheelSelectedVerb.v1)"''',
            '''          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">Verb seleccionat</span>
              <span id="wheel-res-pack" class="px-3 py-1 rounded-full text-xs font-bold bg-white text-indigo-700 border border-indigo-200">Pack</span>
            </div>
            <button onclick="speakEnglish(state.game.wheelSelectedVerb.v1)"''',
            1,
        )
    html = html.replace('app.js?v=4.0', 'app.js?v=4.1')

    logo_open = '<div class="flex items-center gap-3 cursor-pointer" onclick="navigateTo(\'home\')">'
    if logo_open in html:
        html = html.replace(
            logo_open,
            '<button type="button" class="flex items-center gap-3 cursor-pointer text-left" onclick="navigateTo(\'home\')" aria-label="Torna a l’inici">',
            1,
        )
        logo_end = '''<p class="text-[11px] text-slate-500 hidden sm:block">Verbs irregulars en anglès</p>
        </div>
      </div>

      <!-- Menú de navegació principal -->'''
        button_end = '''<p class="text-[11px] text-slate-500 hidden sm:block">Verbs irregulars en anglès</p>
        </div>
      </button>

      <!-- Menú de navegació principal -->'''
        html = html.replace(logo_end, button_end, 1)

    html = html.replace(
        'title="Escoltar">',
        'title="Escoltar" aria-label="Escolta la pronunciació">',
    )
    return html


def polish_wheel_script() -> None:
    path = ROOT / 'app.js'
    text = path.read_text(encoding='utf-8')

    if 'function buildWheelPacks()' not in text:
        pattern = re.compile(
            r'// --- JOC FINAL 4: LA RULETA DELS VERBS \(LUCKY WHEEL\) ---.*?(?=function revealWheelChallenge\(\) \{)',
            re.S,
        )
        text, count = pattern.subn(WHEEL_JS + '\n', text, count=1)
        if count != 1:
            raise RuntimeError('No s’ha pogut substituir la lògica antiga de la ruleta')

    pack_update = "  const packBadge = document.getElementById('wheel-res-pack');\n  if (packBadge) packBadge.textContent = `Pack ${v.pack}`;\n\n"
    anchor = "  document.getElementById('wheel-res-v1').textContent = v.v1;\n"
    if pack_update not in text:
        if anchor not in text:
            raise RuntimeError('No s’ha trobat el punt d’actualització del resultat de la ruleta')
        text = text.replace(anchor, pack_update + anchor, 1)

    path.write_text(text, encoding='utf-8')


def polish_readme() -> None:
    path = ROOT / 'README.md'
    if not path.exists():
        return
    text = path.read_text(encoding='utf-8')
    text = text.replace('11 nivells de 10 verbs', '10 packs de 10 verbs i un últim pack de 8')
    text = text.replace('11 packs de 10', '11 packs d’aprenentatge')
    note = '- **CSS de producció:** Tailwind es compila a `tailwind.css`; la web no depèn del Play CDN de Tailwind.\n'
    if note not in text:
        text += '\n' + note
    path.write_text(text, encoding='utf-8')


def validate() -> None:
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    app = (ROOT / 'app.js').read_text(encoding='utf-8')
    if 'cdn.tailwindcss.com' in html or 'tailwind.config' in html:
        raise RuntimeError('Tailwind Play CDN encara és present a index.html')
    if 'tailwind.css?v=1.0' not in html:
        raise RuntimeError('Falta l’enllaç al CSS compilat')
    if '11 blocs progressius de 10 verbs' in html or 'Packs de 10 verbs alfabèticament' in html:
        raise RuntimeError('Encara queda una descripció incorrecta dels packs')
    if 'VERBS_DATA.slice(0, 12)' in app:
        raise RuntimeError('La ruleta encara mostra només una mostra dels primers verbs')
    if 'function buildWheelPacks()' not in app or 'id="wheel-res-pack"' not in html:
        raise RuntimeError('La ruleta nova per packs no s’ha aplicat correctament')
    if not (ROOT / 'tailwind.css').exists():
        raise RuntimeError('No s’ha generat tailwind.css')


def main() -> None:
    build_tailwind()

    index = ROOT / 'index.html'
    html = polish_index(index.read_text(encoding='utf-8'))
    index.write_text(html, encoding='utf-8')
    polish_wheel_script()
    polish_readme()
    validate()
    print('Poliment final de Verb Quest completat.')


if __name__ == '__main__':
    main()
