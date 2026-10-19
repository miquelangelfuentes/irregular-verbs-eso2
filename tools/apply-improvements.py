from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]

TAILWIND_CDN_RE = re.compile(r'\s*<script\s+src=["\']https://cdn\.tailwindcss\.com["\']></script>\s*', re.I)
TAILWIND_CONFIG_RE = re.compile(r'\s*<script>\s*tailwind\.config\s*=.*?</script>\s*', re.I | re.S)


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
    if 'cdn.tailwindcss.com' in html or 'tailwind.config' in html:
        raise RuntimeError('Tailwind Play CDN encara és present a index.html')
    if 'tailwind.css?v=1.0' not in html:
        raise RuntimeError('Falta l’enllaç al CSS compilat')
    if '11 blocs progressius de 10 verbs' in html or 'Packs de 10 verbs alfabèticament' in html:
        raise RuntimeError('Encara queda una descripció incorrecta dels packs')
    if not (ROOT / 'tailwind.css').exists():
        raise RuntimeError('No s’ha generat tailwind.css')


def main() -> None:
    build_tailwind()

    index = ROOT / 'index.html'
    html = polish_index(index.read_text(encoding='utf-8'))
    index.write_text(html, encoding='utf-8')
    polish_readme()
    validate()
    print('Poliment final de Verb Quest completat.')


if __name__ == '__main__':
    main()
