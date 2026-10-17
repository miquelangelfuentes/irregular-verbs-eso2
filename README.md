# Verb Quest 2n d'ESO · Irregular Verbs Arena ⚡

Una plataforma web interactiva i gamificada perquè l'alumnat de **2n d'ESO** aprengui, practiqui i consolidi els **108 verbs irregulars** del llibre **Active Minds 2 (Burlington English)**.

Dissenyada específicament per a desplegar-se de manera gratuïta i immediata a **GitHub Pages**.

🔗 **URL del lloc web (un cop activat a GitHub Pages):**  
`https://miquelangelfuentes.github.io/irregular-verbs-eso2/`

---

## 🌟 Estructura pedagògica de l'aplicació

L'aprenentatge està dissenyat seguint els principis de la bastida d'aprenentatge (*scaffolding*) i la repetició espaiada acumulativa (*spaced retrieval*):

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PACKS DE 10 ALFABÈTICAMENT (11 nivells de 10 verbs)      │
│    Flashcards 3D · Quiz 4 Opcions · Escriure · Memory ·     │
│    Lletres Desordenades                                     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CHECKPOINTS ACUMULATIUS (Repàs acumulatiu a llarg termini│
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
│    ❤️ Mode Supervivència (3 Vides i comodins)               │
│    📝 Simulacre d'Examen Oficial (nota /10 + Certificat A4) │
│    🎡 La Ruleta dels Verbs (reptes orals i de grup)         │
│    📚 Diccionari & Cercador interactiu amb text a veu       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Detall dels 11 Packs de 10 (Active Minds 2)

| Pack | Rang alfabètic | Verbs inclosos | Total |
| :---: | :--- | :--- | :---: |
| **Pack 1** | **Be – Break** | *be, beat, become, begin, bend, bet, bite, bleed, blow, break* | 10 |
| **Pack 2** | **Bring – Deal** | *bring, build, burn, buy, catch, choose, come, cost, cut, deal* | 10 |
| **Pack 3** | **Dig – Feel** | *dig, do, draw, dream, drink, drive, eat, fall, feed, feel* | 10 |
| **Pack 4** | **Fight – Grow** | *fight, find, fly, forget, forgive, freeze, get, give, go, grow* | 10 |
| **Pack 5** | **Hang – Lay** | *hang, have, hear, hide, hit, hold, hurt, keep, know, lay* | 10 |
| **Pack 6** | **Lead – Mean** | *lead, learn, leave, lend, let, lie, light, lose, make, mean* | 10 |
| **Pack 7** | **Meet – Run** | *meet, overcome, pay, put, quit, read, ride, ring, rise, run* | 10 |
| **Pack 8** | **Say – Show** | *say, see, seek, sell, send, set, shake, shine, shoot, show* | 10 |
| **Pack 9** | **Shut – Spread** | *shut, sing, sink, sit, sleep, smell, speak, spell, spend, spread* | 10 |
| **Pack 10** | **Stand – Tear** | *stand, steal, stick, sting, stink, sweep, swim, take, teach, tear* | 10 |
| **Pack 11** | **Tell – Write** | *tell, think, throw, understand, wake up, wear, win, write* | 8 |

---

## 🎮 Els 5 Jocs dins de cada Pack

1. **🗂️ Flashcards 3D:** Gir tridimensional amb Base Form (V1), Past Simple (V2), Past Participle (V3), transcripció fonètica oficial, pistes mnemotècniques i botó d'àudio.
2. **🎯 Quiz 4 Opcions:** Preguntes ràpides generades dinàmicament amb distractors intel·ligents, ratxes i percentatge d'encert.
3. **✍️ Escriu les Formes:** L'alumne escriu el Past Simple i Past Participle a partir del Base Form o del català, amb correcció flexible (permet formes dobles com *burnt/burned*).
4. **🧩 Memory / Connecta Parelles:** Tauler de fitxes per emparellar el verb en present amb el seu passat/participi o català.
5. **🔤 Lletres Desordenades (Word Scramble):** Ordenar les lletres per fixar l'ortografia (*spelling*).

---

## 🚩 Checkpoints Acumulatius

Per garantir que l'alumnat no oblida els primers packs a mesura que avança el curs, els **Checkpoints** agafen preguntes a l'atzar de **tots els packs acumulats fins a aquell moment**.
- Es requereix un **80% d'encerts** per desbloquejar la medalla.
- El sistema desa el progrés i les medalles obtingudes a `localStorage`.

---

## 👑 Arena de Tots els Verbs (108 verbs en joc)

- **⚡ Contrarellotge (Speed Rush):** 60 o 90 segons amb multiplicadors de combo per fer el rècord màxim de punts.
- **❤️ Supervivència (3 Vides):** Quants verbs consecutius pots encertar? Inclou 3 comodins (50/50, saltar pregunta i pista de la 1a lletra).
- **📝 Simulacre d'Examen Oficial:**
  - Tria 10, 20 o 30 verbs a l'atzar.
  - Graella d'avaluació idèntica a un examen d'aula.
  - Correcció automàtica amb nota sobre 10.
  - **Certificat imprimible en format A4**: Permet introduir el nom de l'alumne/a i grup per lliurar al docent en paper o PDF.
- **🎡 La Ruleta dels Verbs:** Ruleta física animada per fer reptes orals i dinàmiques de grup classe.
- **📚 Diccionari & Cercador:** Cercador en temps real per anglès o català, amb text a veu en anglès i filtres per famílies (*no-change*, *-ought/-aught*, *i-a-u*, etc.).

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
- **Tailwind CSS** (via CDN oficial)
- **Vanilla JavaScript** (sense node_modules ni dependències de compilació)
- **Web Speech API** per al text a veu en anglès
- **Web Audio API** per a efectes de so suaus
- **Canvas-Confetti** per a les celebracions
- **Lucide Icons**
