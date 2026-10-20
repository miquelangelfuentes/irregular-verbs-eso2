# Verb Quest 2n d'ESO - Irregular Verbs Arena ⚡

Plataforma web interactiva i gamificada perquè l'alumnat de **2n d'ESO** aprengui i consolidi els **108 verbs irregulars** del projecte.

**Web:** https://miquelangelfuentes.github.io/irregular-verbs-eso2/

## Estructura d'aprenentatge

Verb Quest distribueix els verbs en **11 packs**. Els deu primers contenen 10 verbs i l'últim en conté 8.

La progressió combina treball per packs amb **6 checkpoints acumulatius**. Els checkpoints recuperen verbs dels packs anteriors, però l'aplicació no programa intervals temporals de repàs i, per tant, no es presenta com un sistema de repetició espaiada.

L'aplicació incorpora també un **Repàs d'errors** que prioritza els verbs en què l'alumnat ha tingut més dificultats. Aquest historial es conserva només al navegador.

## Activitats dels packs

Cada pack inclou diferents formes de recuperació i reconeixement:

- **Flashcards** amb V1, V2 i V3, significat i suport d'àudio.
- **Quiz de resposta múltiple** amb puntuació i registre del millor resultat.
- **Producció escrita** de les formes verbals amb correcció flexible quan hi ha variants acceptades.
- **Memory** per relacionar formes del mateix verb.
- **Lletres desordenades** per treballar l'ortografia.

El domini d'un pack no depèn només del reconeixement. Per obtenir dues estrelles cal arribar com a mínim al **80% tant al quiz com a l'activitat escrita**. Les tres estrelles exigeixen com a mínim un **90% en totes dues evidències**.

## Packs

| Pack | Rang | Total |
| ---: | --- | ---: |
| **1** | *be - break* | 10 |
| **2** | *bring - deal* | 10 |
| **3** | *dig - feel* | 10 |
| **4** | *fight - grow* | 10 |
| **5** | *hang - lay* | 10 |
| **6** | *lead - mean* | 10 |
| **7** | *meet - run* | 10 |
| **8** | *say - show* | 10 |
| **9** | *shut - spread* | 10 |
| **10** | *stand - tear* | 10 |
| **11** | *tell - write* | 8 |

## Checkpoints acumulatius

Els checkpoints combinen preguntes dels packs treballats fins a aquell punt.

| Checkpoint | Packs inclosos | Verbs acumulats |
| --- | --- | ---: |
| **1** | 1-2 | 20 |
| **2** | 1-4 | 40 |
| **3** | 1-6 | 60 |
| **4** | 1-8 | 80 |
| **5** | 1-10 | 100 |
| **Master** | 1-11 | 108 |

Cal obtenir com a mínim un **80% d'encerts** per desbloquejar la medalla corresponent.

## Jocs finals

L'**Arena de tots els verbs irregulars** ofereix actualment **8 jocs finals** que treballen amb el conjunt complet dels 108 verbs:

- **Contrarellotge - Speed Rush** amb temps limitat i combos.
- **Mode supervivència** amb tres vides i comodins.
- **Detector d'intrusos** per identificar formes incorrectes habituals.
- **Trencaclosques de trios** per connectar V1, V2 i V3.
- **Verbs en context** amb frases contextualitzades i selecció de la forma adequada.
- **Classificador de famílies** segons patrons morfològics i fonètics.
- **Simulacre d'examen** amb nota sobre 10 i certificat A4 imprimible o exportable a PDF.
- **Ruleta dels verbs** que representa els 11 packs i pot seleccionar qualsevol dels 108 verbs per a activitats orals o de grup.

El **Diccionari** permet cercar per anglès o català i incorpora text a veu en anglès.

## Navegació i progrés

Les vistes principals utilitzen fragments d'URL com `#packs`, `#review` o `#dictionary`. Això permet compartir una secció concreta i manté un comportament coherent amb el botó Enrere del navegador.

El progrés, les medalles i l'historial d'errors es desen amb `localStorage`. No cal crear cap compte i aquestes dades no s'envien a cap servidor propi.

## Mode clar, mode fosc i accessibilitat

Verb Quest incorpora **mode clar i mode fosc**. La preferència queda desada al navegador; si no n'hi ha cap, la web respecta la configuració del sistema.

La capa compartida de tema es complementa amb ajustos específics de contrast per als estats dels jocs. El repositori inclou una auditoria automàtica amb **Playwright** i **axe-core** que revisa totes les vistes en mode clar i fosc.

També hi ha focus visible per a la navegació amb teclat i suport per a la preferència de moviment reduït.

## Producció i desplegament

El projecte es publica com a lloc estàtic a **GitHub Pages**.

Tailwind CSS es compila a `tailwind.css`. La versió publicada **no depèn de Tailwind Play CDN**. El navegador executa JavaScript sense framework i no necessita Node.js en temps d'execució.

El workflow `.github/workflows/apply-improvements.yml` aplica els ajustos de producció. El workflow `.github/workflows/validate-site.yml` comprova la sintaxi i executa l'auditoria de contrast.

## Tecnologies

- HTML5 i CSS compilat amb Tailwind CSS.
- JavaScript sense framework.
- Web Speech API i Web Audio API.
- Lucide Icons i Canvas Confetti.
- Playwright i axe-core per a la validació de contrast.
- GitHub Actions per a la construcció i les comprovacions automàtiques.

## Llicències

- **Codi** - [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html).
- **Continguts educatius** - [Creative Commons CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).
