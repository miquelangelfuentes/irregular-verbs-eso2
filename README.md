# Verb Quest 2n d'ESO - Irregular Verbs Arena ⚡

Una plataforma web interactiva i gamificada perquè l'alumnat de **2n d'ESO** aprengui, practiqui i consolidi els **108 verbs irregulars**.

Dissenyada específicament per a desplegar-se de manera gratuïta i immediata a **GitHub Pages**.

🔗 **URL del lloc web (un cop activat a GitHub Pages):**  
`https://miquelangelfuentes.github.io/irregular-verbs-eso2/`

---

## 🌟 Estructura pedagògica de l'aplicació

L'aprenentatge combina bastides de suport amb pràctica de recuperació acumulativa. Els checkpoints recuperen verbs de packs anteriors, però l'aplicació no programa els repassos segons intervals temporals, de manera que no es presenta com un sistema de repetició espaiada.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PACKS D’APRENENTATGE (10 packs de 10 + un pack de 8)    │
│    Flashcards 3D - Quiz de 4 opcions - Escriure - Memory -  │
│    Lletres desordenades                                     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CHECKPOINTS ACUMULATIUS (Repàs acumulat a llarg termini) │
│    🥉 Checkpoint 1 (Packs 1-2: 20 verbs)                    │
│    🥈 Checkpoint 2 (Packs 1-4: 40 verbs)                    │
│    🥇 Checkpoint 3 (Packs 1-6: 60 verbs)                    │
│    💎 Checkpoint 4 (Packs 1-8: 80 verbs)                    │
│    👑 Checkpoint 5 (Packs 1-10: 100 verbs)                  │
│    🏆 Checkpoint Master (Packs 1-11: 108 verbs)             │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ARENA DE TOTS ELS VERBS (Jocs globals amb els 108 verbs) │
│    ⚡ Contrarellotge (Speed Rush)                           │
│    ❤️ Mode supervivència (3 vides i comodins)               │
│    📝 Simulacre d'examen (nota /10 + certificat A4)         │
│    🎡 La ruleta dels verbs (reptes orals i de grup)         │
│    📚 Diccionari i cercador interactiu amb text a veu       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Detall dels 11 packs d’aprenentatge

| Pack | Rang alfabètic | Verbs inclosos | Total |
| :---: | :--- | :--- | :---: |
| **Pack 1** | **Be – break** | *be, beat, become, begin, bend, bet, bite, bleed, blow, break* | 10 |
| **Pack 2** | **Bring – deal** | *bring, build, burn, buy, catch, choose, come, cost, cut, deal* | 10 |
| **Pack 3** | **Dig – feel** | *dig, do, draw, dream, drink, drive, eat, fall, feed, feel* | 10 |
| **Pack 4** | **Fight – grow** | *fight, find, fly, forget, forgive, freeze, get, give, go, grow* | 10 |
| **Pack 5** | **Hang – lay** | *hang, have, hear, hide, hit, hold, hurt, keep, know, lay* | 10 |
| **Pack 6** | **Lead – mean** | *lead, learn, leave, lend, let, lie, light, lose, make, mean* | 10 |
| **Pack 7** | **Meet – run** | *meet, overcome, pay, put, quit, read, ride, ring, rise, run* | 10 |
| **Pack 8** | **Say – show** | *say, see, seek, sell, send, set, shake, shine, shoot, show* | 10 |
| **Pack 9** | **Shut – spread** | *shut, sing, sink, sit, sleep, smell, speak, spell, spend, spread* | 10 |
| **Pack 10** | **Stand – tear** | *stand, steal, stick, sting, stink, sweep, swim, take, teach, tear* | 10 |
| **Pack 11** | **Tell – write** | *tell, think, throw, understand, wake up, wear, win, write* | 8 |

---

## 🎮 Activitats dins de cada pack

1. **🗂️ Flashcards 3D:** gir tridimensional amb base form (V1), past simple (V2), past participle (V3), transcripció fonètica, pistes mnemotècniques i botó d'àudio.
2. **🎯 Quiz de 4 opcions:** preguntes ràpides generades dinàmicament amb distractors intel·ligents, ratxes i percentatge d'encert.
3. **✍️ Escriu les formes:** l'alumne escriu el past simple i past participle a partir de la forma base o del català, amb correcció flexible (permet formes dobles com *burnt/burned*).
4. **🧩 Memory / connecta parelles:** tauler de fitxes per emparellar el verb en present amb el seu passat/participi o català.
5. **🔤 Lletres desordenades (Word Scramble):** ordenar les lletres per fixar l'ortografia (*spelling*).

---


## 🧠 Repàs dels meus errors

L'aplicació registra localment els verbs en què l'alumnat s'equivoca i crea una cua de repàs personalitzada. Els verbs amb més dificultat apareixen primer i es practiquen mitjançant recuperació escrita de V2 i V3. Aquest historial es desa només al navegador mitjançant `localStorage`.

El domini d'un pack ja no depèn només del reconeixement en un quiz. Per obtenir dues estrelles, cal arribar com a mínim al **80% tant al quiz com a l'activitat escrita**. Les tres estrelles exigeixen com a mínim un **90% en totes dues evidències**.

---

## 🚩 Checkpoints acumulatius

Per garantir que l'alumnat no oblida els primers packs a mesura que avança el curs, els **checkpoints** agafen preguntes a l'atzar de **tots els packs acumulats fins a aquell moment**.
- Es requereix un **80% d'encerts** per desbloquejar la medalla.
- El sistema desa el progrés, les medalles, les puntuacions de quiz i producció escrita i l’historial d’errors a `localStorage`.

---

## 👑 Arena de tots els verbs (108 verbs en joc)

- **⚡ Contrarellotge (Speed Rush):** 60 o 90 segons amb multiplicadors de combo per fer el rècord màxim de punts.
- **❤️ Mode supervivència (3 vides):** quants verbs consecutius pots encertar? Inclou 3 comodins (50/50, saltar pregunta i pista de la 1a lletra).
- **📝 Simulacre d'examen:**
  - Tria 10, 20 o 30 verbs a l'atzar.
  - Graella d'avaluació idèntica a un examen d'aula.
  - Correcció automàtica amb nota sobre 10.
  - **Certificat imprimible en format A4**: permet introduir el nom de l'alumne/a i grup per lliurar al docent en paper o PDF.
- **🎡 La ruleta dels verbs:** ruleta física animada per fer reptes orals i dinàmiques de grup classe.
- **📚 Diccionari i cercador:** cercador en temps real per anglès o català, amb text a veu en anglès i filtres per famílies (*no-change*, *-ought/-aught*, *i-a-u*, etc.).
- **Navegació compartible:** les vistes principals utilitzen fragments d’URL (`#packs`, `#review`, `#dictionary`, etc.) perquè es puguin enllaçar directament i el botó Enrere del navegador funcioni de manera coherent.
- **Navegació compartible:** les vistes principals utilitzen fragments d’URL (`#packs`, `#review`, `#dictionary`, etc.) perquè es puguin enllaçar directament i el botó Enrere del navegador funcioni de manera coherent.

---

## 🚀 Com publicar a GitHub Pages en 3 minuts

1. **Crea el repositori a GitHub:**
   - Entra a [GitHub.com/new](https://github.com/new).
   - Nom del repositori: `irregular-verbs-eso2`
   - Tipus: **Public** (Públic).

2. **Puja els fitxers des del terminal:**
   Obre el terminal a la carpeta del projecte:
   ```bash
   cd c:\Users\mique\Documents\Antigravity\irregular-verbs-eso2
   git add .
   git commit -m "Initial commit: Verb Quest 2n ESO Irregular Verbs"
   git branch -M main
   git remote add origin https://github.com/miquelangelfuentes/irregular-verbs-eso2.git
   git push -u origin main
   ```

3. **Activa GitHub Pages:**
   - A GitHub, ves a la pestanya **Settings** del teu repositori.
   - Al menú lateral esquerre, fes clic a **Pages**.
   - A l'apartat **Branch**, tria `main` i la carpeta `/ (root)`.
   - Fes clic a **Save**.
   - En 1-2 minuts, la web estarà en línia a:  
     `https://miquelangelfuentes.github.io/irregular-verbs-eso2/`

---

## 🛠️ Tecnologies

- **HTML5 semàntic**
- **Tailwind CSS** (via CDN)
- **Vanilla JavaScript** (sense node_modules ni dependències de compilació)
- **Web Speech API** per al text a veu en anglès
- **Web Audio API** per a efectes de so suaus
- **Canvas-Confetti** per a les celebracions
- **Lucide Icons**

---

## 📄 Llicències

- **Codi:** sota llicència [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html).
- **Continguts educatius:** sota llicència [Creative Commons CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ca).

