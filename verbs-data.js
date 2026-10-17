// Dataset complet dels 108 verbs irregulars d'Active Minds 2 (Burlington English, pàg. 114 - 115)
// Adaptat per a l'alumnat de 2n d'ESO de Catalunya.

const VERBS_DATA = [
  // --- PACK 1 (1 - 10) ---
  {
    id: 1, pack: 1,
    v1: "be", v2: "was/were", v3: "been",
    cat: "ser, estar",
    p1: "/biː/", p2: "/wɒz/wɜː/", p3: "/biːn/",
    accept_v2: ["was", "were", "was/were", "was / were"],
    accept_v3: ["been"],
    family: "especial", tip: "Recorda: I/he/she/it was, you/we/they were."
  },
  {
    id: 2, pack: 1,
    v1: "beat", v2: "beat", v3: "beaten",
    cat: "donar cops a",
    p1: "/biːt/", p2: "/biːt/", p3: "/ˈbiːtn/",
    accept_v2: ["beat"], accept_v3: ["beaten"],
    family: "v1-eq-v2"
  },
  {
    id: 3, pack: 1,
    v1: "become", v2: "became", v3: "become",
    cat: "convertir-se, fer-se",
    p1: "/bɪˈkʌm/", p2: "/bɪˈkeɪm/", p3: "/bɪˈkʌm/",
    accept_v2: ["became"], accept_v3: ["become"],
    family: "v1-eq-v3", tip: "Segueix el mateix patró que come-came-come."
  },
  {
    id: 4, pack: 1,
    v1: "begin", v2: "began", v3: "begun",
    cat: "començar",
    p1: "/bɪˈɡɪn/", p2: "/bɪˈɡæn/", p3: "/bɪˈɡʌn/",
    accept_v2: ["began"], accept_v3: ["begun"],
    family: "i-a-u", tip: "Patró i-a-u com drink-drank-drunk i sing-sang-sung."
  },
  {
    id: 5, pack: 1,
    v1: "bend", v2: "bent", v3: "bent",
    cat: "doblegar(-se)",
    p1: "/bend/", p2: "/bent/", p3: "/bent/",
    accept_v2: ["bent"], accept_v3: ["bent"],
    family: "d-to-t"
  },
  {
    id: 6, pack: 1,
    v1: "bet", v2: "bet", v3: "bet",
    cat: "apostar",
    p1: "/bet/", p2: "/bet/", p3: "/bet/",
    accept_v2: ["bet"], accept_v3: ["bet"],
    family: "no-change", tip: "Totes 3 formes són idèntiques!"
  },
  {
    id: 7, pack: 1,
    v1: "bite", v2: "bit", v3: "bitten",
    cat: "mossegar",
    p1: "/baɪt/", p2: "/bɪt/", p3: "/ˈbɪtn/",
    accept_v2: ["bit"], accept_v3: ["bitten"],
    family: "double-consonant"
  },
  {
    id: 8, pack: 1,
    v1: "bleed", v2: "bled", v3: "bled",
    cat: "sagnar",
    p1: "/bliːd/", p2: "/bled/", p3: "/bled/",
    accept_v2: ["bled"], accept_v3: ["bled"],
    family: "ee-to-e"
  },
  {
    id: 9, pack: 1,
    v1: "blow", v2: "blew", v3: "blown",
    cat: "bufar",
    p1: "/bləʊ/", p2: "/bluː/", p3: "/bləʊn/",
    accept_v2: ["blew"], accept_v3: ["blown"],
    family: "ow-ew-own", tip: "Patró -ew / -own com grow, throw, know."
  },
  {
    id: 10, pack: 1,
    v1: "break", v2: "broke", v3: "broken",
    cat: "trencar",
    p1: "/breɪk/", p2: "/brəʊk/", p3: "/ˈbrəʊkən/",
    accept_v2: ["broke"], accept_v3: ["broken"],
    family: "o-en"
  },

  // --- PACK 2 (11 - 20) ---
  {
    id: 11, pack: 2,
    v1: "bring", v2: "brought", v3: "brought",
    cat: "portar",
    p1: "/brɪŋ/", p2: "/brɔːt/", p3: "/brɔːt/",
    accept_v2: ["brought"], accept_v3: ["brought"],
    family: "ought-aught", tip: "Compte amb la 'r': brought (portar) vs bought (comprar)."
  },
  {
    id: 12, pack: 2,
    v1: "build", v2: "built", v3: "built",
    cat: "construir",
    p1: "/bɪld/", p2: "/bɪlt/", p3: "/bɪlt/",
    accept_v2: ["built"], accept_v3: ["built"],
    family: "d-to-t"
  },
  {
    id: 13, pack: 2,
    v1: "burn", v2: "burnt/burned", v3: "burnt/burned",
    cat: "cremar",
    p1: "/bɜːn/", p2: "/bɜːnt//bɜːnd/", p3: "/bɜːnt//bɜːnd/",
    accept_v2: ["burnt", "burned", "burnt/burned"],
    accept_v3: ["burnt", "burned", "burnt/burned"],
    family: "t-or-ed"
  },
  {
    id: 14, pack: 2,
    v1: "buy", v2: "bought", v3: "bought",
    cat: "comprar",
    p1: "/baɪ/", p2: "/bɔːt/", p3: "/bɔːt/",
    accept_v2: ["bought"], accept_v3: ["bought"],
    family: "ought-aught", tip: "Sense 'r': bought (comprar)."
  },
  {
    id: 15, pack: 2,
    v1: "catch", v2: "caught", v3: "caught",
    cat: "agafar, enxampar",
    p1: "/kætʃ/", p2: "/kɔːt/", p3: "/kɔːt/",
    accept_v2: ["caught"], accept_v3: ["caught"],
    family: "ought-aught", tip: "S'escriu amb -aught (com teach -> taught)."
  },
  {
    id: 16, pack: 2,
    v1: "choose", v2: "chose", v3: "chosen",
    cat: "triar",
    p1: "/tʃuːz/", p2: "/tʃəʊz/", p3: "/ˈtʃəʊzn/",
    accept_v2: ["chose"], accept_v3: ["chosen"],
    family: "o-en", tip: "V2 només té una 'o': chose."
  },
  {
    id: 17, pack: 2,
    v1: "come", v2: "came", v3: "come",
    cat: "venir",
    p1: "/kʌm/", p2: "/keɪm/", p3: "/kʌm/",
    accept_v2: ["came"], accept_v3: ["come"],
    family: "v1-eq-v3"
  },
  {
    id: 18, pack: 2,
    v1: "cost", v2: "cost", v3: "cost",
    cat: "costar",
    p1: "/kɒst/", p2: "/kɒst/", p3: "/kɒst/",
    accept_v2: ["cost"], accept_v3: ["cost"],
    family: "no-change"
  },
  {
    id: 19, pack: 2,
    v1: "cut", v2: "cut", v3: "cut",
    cat: "tallar",
    p1: "/kʌt/", p2: "/kʌt/", p3: "/kʌt/",
    accept_v2: ["cut"], accept_v3: ["cut"],
    family: "no-change"
  },
  {
    id: 20, pack: 2,
    v1: "deal", v2: "dealt", v3: "dealt",
    cat: "donar / repartir (cartes)",
    p1: "/diːl/", p2: "/delt/", p3: "/delt/",
    accept_v2: ["dealt"], accept_v3: ["dealt"],
    family: "ea-to-e-t"
  },

  // --- PACK 3 (21 - 30) ---
  {
    id: 21, pack: 3,
    v1: "dig", v2: "dug", v3: "dug",
    cat: "cavar",
    p1: "/dɪɡ/", p2: "/dʌɡ/", p3: "/dʌɡ/",
    accept_v2: ["dug"], accept_v3: ["dug"],
    family: "i-to-u"
  },
  {
    id: 22, pack: 3,
    v1: "do", v2: "did", v3: "done",
    cat: "fer",
    p1: "/duː/", p2: "/dɪd/", p3: "/dʌn/",
    accept_v2: ["did"], accept_v3: ["done"],
    family: "especial"
  },
  {
    id: 23, pack: 3,
    v1: "draw", v2: "drew", v3: "drawn",
    cat: "dibuixar",
    p1: "/drɔː/", p2: "/druː/", p3: "/drɔːn/",
    accept_v2: ["drew"], accept_v3: ["drawn"],
    family: "ow-ew-own"
  },
  {
    id: 24, pack: 3,
    v1: "dream", v2: "dreamt/dreamed", v3: "dreamt/dreamed",
    cat: "somiar",
    p1: "/driːm/", p2: "/dremt//driːmd/", p3: "/dremt//driːmd/",
    accept_v2: ["dreamt", "dreamed", "dreamt/dreamed"],
    accept_v3: ["dreamt", "dreamed", "dreamt/dreamed"],
    family: "t-or-ed"
  },
  {
    id: 25, pack: 3,
    v1: "drink", v2: "drank", v3: "drunk",
    cat: "beure",
    p1: "/drɪŋk/", p2: "/dræŋk/", p3: "/drʌŋk/",
    accept_v2: ["drank"], accept_v3: ["drunk"],
    family: "i-a-u"
  },
  {
    id: 26, pack: 3,
    v1: "drive", v2: "drove", v3: "driven",
    cat: "conduir",
    p1: "/draɪv/", p2: "/drəʊv/", p3: "/ˈdrɪvn/",
    accept_v2: ["drove"], accept_v3: ["driven"],
    family: "o-en"
  },
  {
    id: 27, pack: 3,
    v1: "eat", v2: "ate", v3: "eaten",
    cat: "menjar",
    p1: "/iːt/", p2: "/et/", p3: "/ˈiːtn/",
    accept_v2: ["ate"], accept_v3: ["eaten"],
    family: "especial"
  },
  {
    id: 28, pack: 3,
    v1: "fall", v2: "fell", v3: "fallen",
    cat: "caure",
    p1: "/fɔːl/", p2: "/fel/", p3: "/ˈfɔːlən/",
    accept_v2: ["fell"], accept_v3: ["fallen"],
    family: "en-participle"
  },
  {
    id: 29, pack: 3,
    v1: "feed", v2: "fed", v3: "fed",
    cat: "alimentar",
    p1: "/fiːd/", p2: "/fed/", p3: "/fed/",
    accept_v2: ["fed"], accept_v3: ["fed"],
    family: "ee-to-e"
  },
  {
    id: 30, pack: 3,
    v1: "feel", v2: "felt", v3: "felt",
    cat: "sentir-se",
    p1: "/fiːl/", p2: "/felt/", p3: "/felt/",
    accept_v2: ["felt"], accept_v3: ["felt"],
    family: "ee-to-e"
  },

  // --- PACK 4 (31 - 40) ---
  {
    id: 31, pack: 4,
    v1: "fight", v2: "fought", v3: "fought",
    cat: "lluitar, barallar-se",
    p1: "/faɪt/", p2: "/fɔːt/", p3: "/fɔːt/",
    accept_v2: ["fought"], accept_v3: ["fought"],
    family: "ought-aught"
  },
  {
    id: 32, pack: 4,
    v1: "find", v2: "found", v3: "found",
    cat: "trobar",
    p1: "/faɪnd/", p2: "/faʊnd/", p3: "/faʊnd/",
    accept_v2: ["found"], accept_v3: ["found"],
    family: "ind-ound"
  },
  {
    id: 33, pack: 4,
    v1: "fly", v2: "flew", v3: "flown",
    cat: "volar",
    p1: "/flaɪ/", p2: "/fluː/", p3: "/fləʊn/",
    accept_v2: ["flew"], accept_v3: ["flown"],
    family: "ow-ew-own"
  },
  {
    id: 34, pack: 4,
    v1: "forget", v2: "forgot", v3: "forgotten",
    cat: "oblidar",
    p1: "/fəˈɡet/", p2: "/fəˈɡɒt/", p3: "/fəˈɡɒtn/",
    accept_v2: ["forgot"], accept_v3: ["forgotten"],
    family: "o-en"
  },
  {
    id: 35, pack: 4,
    v1: "forgive", v2: "forgave", v3: "forgiven",
    cat: "perdonar",
    p1: "/fəˈɡɪv/", p2: "/fəˈɡeɪv/", p3: "/fəˈɡɪvn/",
    accept_v2: ["forgave"], accept_v3: ["forgiven"],
    family: "give-pattern"
  },
  {
    id: 36, pack: 4,
    v1: "freeze", v2: "froze", v3: "frozen",
    cat: "congelar(-se)",
    p1: "/friːz/", p2: "/frəʊz/", p3: "/ˈfrəʊzn/",
    accept_v2: ["froze"], accept_v3: ["frozen"],
    family: "o-en"
  },
  {
    id: 37, pack: 4,
    v1: "get", v2: "got", v3: "got",
    cat: "aconseguir; arribar",
    p1: "/ɡet/", p2: "/ɡɒt/", p3: "/ɡɒt/",
    accept_v2: ["got"], accept_v3: ["got", "gotten"],
    family: "o-participle", tip: "En anglès britànic V3 és 'got'."
  },
  {
    id: 38, pack: 4,
    v1: "give", v2: "gave", v3: "given",
    cat: "donar",
    p1: "/ɡɪv/", p2: "/ɡeɪv/", p3: "/ˈɡɪvn/",
    accept_v2: ["gave"], accept_v3: ["given"],
    family: "give-pattern"
  },
  {
    id: 39, pack: 4,
    v1: "go", v2: "went", v3: "gone",
    cat: "anar",
    p1: "/ɡəʊ/", p2: "/went/", p3: "/ɡɒn/",
    accept_v2: ["went"], accept_v3: ["gone"],
    family: "especial"
  },
  {
    id: 40, pack: 4,
    v1: "grow", v2: "grew", v3: "grown",
    cat: "créixer; cultivar",
    p1: "/ɡrəʊ/", p2: "/ɡruː/", p3: "/ɡrəʊn/",
    accept_v2: ["grew"], accept_v3: ["grown"],
    family: "ow-ew-own"
  },

  // --- PACK 5 (41 - 50) ---
  {
    id: 41, pack: 5,
    v1: "hang", v2: "hung/hanged", v3: "hung/hanged",
    cat: "penjar",
    p1: "/hæŋ/", p2: "/hʌŋ//hæŋd/", p3: "/hʌŋ//hæŋd/",
    accept_v2: ["hung", "hanged", "hung/hanged"],
    accept_v3: ["hung", "hanged", "hung/hanged"],
    family: "t-or-ed"
  },
  {
    id: 42, pack: 5,
    v1: "have", v2: "had", v3: "had",
    cat: "tenir, haver",
    p1: "/hæv/", p2: "/hæd/", p3: "/hæd/",
    accept_v2: ["had"], accept_v3: ["had"],
    family: "especial"
  },
  {
    id: 43, pack: 5,
    v1: "hear", v2: "heard", v3: "heard",
    cat: "sentir",
    p1: "/hɪə/", p2: "/hɜːd/", p3: "/hɜːd/",
    accept_v2: ["heard"], accept_v3: ["heard"],
    family: "add-d"
  },
  {
    id: 44, pack: 5,
    v1: "hide", v2: "hid", v3: "hidden",
    cat: "amagar(-se)",
    p1: "/haɪd/", p2: "/hɪd/", p3: "/ˈhɪdn/",
    accept_v2: ["hid"], accept_v3: ["hidden"],
    family: "double-consonant"
  },
  {
    id: 45, pack: 5,
    v1: "hit", v2: "hit", v3: "hit",
    cat: "colpejar, pegar",
    p1: "/hɪt/", p2: "/hɪt/", p3: "/hɪt/",
    accept_v2: ["hit"], accept_v3: ["hit"],
    family: "no-change"
  },
  {
    id: 46, pack: 5,
    v1: "hold", v2: "held", v3: "held",
    cat: "subjectar",
    p1: "/həʊld/", p2: "/held/", p3: "/held/",
    accept_v2: ["held"], accept_v3: ["held"],
    family: "o-to-e"
  },
  {
    id: 47, pack: 5,
    v1: "hurt", v2: "hurt", v3: "hurt",
    cat: "ferir, fer mal",
    p1: "/hɜːt/", p2: "/hɜːt/", p3: "/hɜːt/",
    accept_v2: ["hurt"], accept_v3: ["hurt"],
    family: "no-change"
  },
  {
    id: 48, pack: 5,
    v1: "keep", v2: "kept", v3: "kept",
    cat: "guardar, mantenir",
    p1: "/kiːp/", p2: "/kept/", p3: "/kept/",
    accept_v2: ["kept"], accept_v3: ["kept"],
    family: "ee-to-e"
  },
  {
    id: 49, pack: 5,
    v1: "know", v2: "knew", v3: "known",
    cat: "saber, conèixer",
    p1: "/nəʊ/", p2: "/njuː/", p3: "/nəʊn/",
    accept_v2: ["knew"], accept_v3: ["known"],
    family: "ow-ew-own"
  },
  {
    id: 50, pack: 5,
    v1: "lay", v2: "laid", v3: "laid",
    cat: "posar; estendre",
    p1: "/leɪ/", p2: "/leɪd/", p3: "/leɪd/",
    accept_v2: ["laid"], accept_v3: ["laid"],
    family: "ay-to-aid"
  },

  // --- PACK 6 (51 - 60) ---
  {
    id: 51, pack: 6,
    v1: "lead", v2: "led", v3: "led",
    cat: "guiar, conduir",
    p1: "/liːd/", p2: "/led/", p3: "/led/",
    accept_v2: ["led"], accept_v3: ["led"],
    family: "ea-to-e"
  },
  {
    id: 52, pack: 6,
    v1: "learn", v2: "learnt/learned", v3: "learnt/learned",
    cat: "aprendre",
    p1: "/lɜːn/", p2: "/lɜːnt//lɜːnd/", p3: "/lɜːnt//lɜːnd/",
    accept_v2: ["learnt", "learned", "learnt/learned"],
    accept_v3: ["learnt", "learned", "learnt/learned"],
    family: "t-or-ed"
  },
  {
    id: 53, pack: 6,
    v1: "leave", v2: "left", v3: "left",
    cat: "deixar; marxar, sortir",
    p1: "/liːv/", p2: "/left/", p3: "/left/",
    accept_v2: ["left"], accept_v3: ["left"],
    family: "ea-to-e-t"
  },
  {
    id: 54, pack: 6,
    v1: "lend", v2: "lent", v3: "lent",
    cat: "prestar, deixar",
    p1: "/lend/", p2: "/lent/", p3: "/lent/",
    accept_v2: ["lent"], accept_v3: ["lent"],
    family: "d-to-t"
  },
  {
    id: 55, pack: 6,
    v1: "let", v2: "let", v3: "let",
    cat: "permetre, deixar",
    p1: "/let/", p2: "/let/", p3: "/let/",
    accept_v2: ["let"], accept_v3: ["let"],
    family: "no-change"
  },
  {
    id: 56, pack: 6,
    v1: "lie", v2: "lay", v3: "lain",
    cat: "estirar-se",
    p1: "/laɪ/", p2: "/leɪ/", p3: "/leɪn/",
    accept_v2: ["lay"], accept_v3: ["lain"],
    family: "especial", tip: "Important: estirar-se és lie-lay-lain. Mentir és regular: lie-lied-lied."
  },
  {
    id: 57, pack: 6,
    v1: "light", v2: "lit", v3: "lit",
    cat: "encendre",
    p1: "/laɪt/", p2: "/lɪt/", p3: "/lɪt/",
    accept_v2: ["lit", "lighted"], accept_v3: ["lit", "lighted"],
    family: "i-short"
  },
  {
    id: 58, pack: 6,
    v1: "lose", v2: "lost", v3: "lost",
    cat: "perdre",
    p1: "/luːz/", p2: "/lɒst/", p3: "/lɒst/",
    accept_v2: ["lost"], accept_v3: ["lost"],
    family: "o-to-ost"
  },
  {
    id: 59, pack: 6,
    v1: "make", v2: "made", v3: "made",
    cat: "fer, fabricar",
    p1: "/meɪk/", p2: "/meɪd/", p3: "/meɪd/",
    accept_v2: ["made"], accept_v3: ["made"],
    family: "especial"
  },
  {
    id: 60, pack: 6,
    v1: "mean", v2: "meant", v3: "meant",
    cat: "significar, voler dir",
    p1: "/miːn/", p2: "/ment/", p3: "/ment/",
    accept_v2: ["meant"], accept_v3: ["meant"],
    family: "ea-to-e-t"
  },

  // --- PACK 7 (61 - 70) ---
  {
    id: 61, pack: 7,
    v1: "meet", v2: "met", v3: "met",
    cat: "conèixer; quedar amb",
    p1: "/miːt/", p2: "/met/", p3: "/met/",
    accept_v2: ["met"], accept_v3: ["met"],
    family: "ee-to-e"
  },
  {
    id: 62, pack: 7,
    v1: "overcome", v2: "overcame", v3: "overcome",
    cat: "superar",
    p1: "/ˌəʊvəˈkʌm/", p2: "/ˌəʊvəˈkeɪm/", p3: "/ˌəʊvəˈkʌm/",
    accept_v2: ["overcame"], accept_v3: ["overcome"],
    family: "v1-eq-v3", tip: "Format pel prefix over- + come-came-come."
  },
  {
    id: 63, pack: 7,
    v1: "pay", v2: "paid", v3: "paid",
    cat: "pagar",
    p1: "/peɪ/", p2: "/peɪd/", p3: "/peɪd/",
    accept_v2: ["paid"], accept_v3: ["paid"],
    family: "ay-to-aid"
  },
  {
    id: 64, pack: 7,
    v1: "put", v2: "put", v3: "put",
    cat: "posar",
    p1: "/pʊt/", p2: "/pʊt/", p3: "/pʊt/",
    accept_v2: ["put"], accept_v3: ["put"],
    family: "no-change"
  },
  {
    id: 65, pack: 7,
    v1: "quit", v2: "quit/quitted", v3: "quit/quitted",
    cat: "deixar (de)",
    p1: "/kwɪt/", p2: "/kwɪt//ˈkwɪtɪd/", p3: "/kwɪt//ˈkwɪtɪd/",
    accept_v2: ["quit", "quitted", "quit/quitted"],
    accept_v3: ["quit", "quitted", "quit/quitted"],
    family: "no-change"
  },
  {
    id: 66, pack: 7,
    v1: "read", v2: "read", v3: "read",
    cat: "llegir",
    p1: "/riːd/", p2: "/red/", p3: "/red/",
    accept_v2: ["read"], accept_v3: ["read"],
    family: "no-change", tip: "S'escriuen igual, però V2 i V3 es pronuncien /red/ com el color vermell!"
  },
  {
    id: 67, pack: 7,
    v1: "ride", v2: "rode", v3: "ridden",
    cat: "muntar / anar en; pujar a",
    p1: "/raɪd/", p2: "/rəʊd/", p3: "/ˈrɪdn/",
    accept_v2: ["rode"], accept_v3: ["ridden"],
    family: "o-en"
  },
  {
    id: 68, pack: 7,
    v1: "ring", v2: "rang", v3: "rung",
    cat: "trucar (per telèfon)",
    p1: "/rɪŋ/", p2: "/ræŋ/", p3: "/rʌŋ/",
    accept_v2: ["rang"], accept_v3: ["rung"],
    family: "i-a-u"
  },
  {
    id: 69, pack: 7,
    v1: "rise", v2: "rose", v3: "risen",
    cat: "aixecar-se, alçar-se",
    p1: "/raɪz/", p2: "/rəʊz/", p3: "/ˈrɪzn/",
    accept_v2: ["rose"], accept_v3: ["risen"],
    family: "o-en"
  },
  {
    id: 70, pack: 7,
    v1: "run", v2: "ran", v3: "run",
    cat: "córrer",
    p1: "/rʌn/", p2: "/ræn/", p3: "/rʌn/",
    accept_v2: ["ran"], accept_v3: ["run"],
    family: "v1-eq-v3"
  },

  // --- PACK 8 (71 - 80) ---
  {
    id: 71, pack: 8,
    v1: "say", v2: "said", v3: "said",
    cat: "dir",
    p1: "/seɪ/", p2: "/sed/", p3: "/sed/",
    accept_v2: ["said"], accept_v3: ["said"],
    family: "ay-to-aid", tip: "Pronunciació: /sed/."
  },
  {
    id: 72, pack: 8,
    v1: "see", v2: "saw", v3: "seen",
    cat: "veure",
    p1: "/siː/", p2: "/sɔː/", p3: "/siːn/",
    accept_v2: ["saw"], accept_v3: ["seen"],
    family: "especial"
  },
  {
    id: 73, pack: 8,
    v1: "seek", v2: "sought", v3: "sought",
    cat: "buscar; demanar (consell)",
    p1: "/siːk/", p2: "/sɔːt/", p3: "/sɔːt/",
    accept_v2: ["sought"], accept_v3: ["sought"],
    family: "ought-aught"
  },
  {
    id: 74, pack: 8,
    v1: "sell", v2: "sold", v3: "sold",
    cat: "vendre",
    p1: "/sel/", p2: "/səʊld/", p3: "/səʊld/",
    accept_v2: ["sold"], accept_v3: ["sold"],
    family: "ell-to-old"
  },
  {
    id: 75, pack: 8,
    v1: "send", v2: "sent", v3: "sent",
    cat: "enviar",
    p1: "/send/", p2: "/sent/", p3: "/sent/",
    accept_v2: ["sent"], accept_v3: ["sent"],
    family: "d-to-t"
  },
  {
    id: 76, pack: 8,
    v1: "set", v2: "set", v3: "set",
    cat: "col·locar, posar",
    p1: "/set/", p2: "/set/", p3: "/set/",
    accept_v2: ["set"], accept_v3: ["set"],
    family: "no-change"
  },
  {
    id: 77, pack: 8,
    v1: "shake", v2: "shook", v3: "shaken",
    cat: "sacsejar",
    p1: "/ʃeɪk/", p2: "/ʃʊk/", p3: "/ˈʃeɪkən/",
    accept_v2: ["shook"], accept_v3: ["shaken"],
    family: "take-pattern"
  },
  {
    id: 78, pack: 8,
    v1: "shine", v2: "shone", v3: "shone",
    cat: "brillar",
    p1: "/ʃaɪn/", p2: "/ʃɒn/", p3: "/ʃɒn/",
    accept_v2: ["shone"], accept_v3: ["shone"],
    family: "i-to-o"
  },
  {
    id: 79, pack: 8,
    v1: "shoot", v2: "shot", v3: "shot",
    cat: "disparar",
    p1: "/ʃuːt/", p2: "/ʃɒt/", p3: "/ʃɒt/",
    accept_v2: ["shot"], accept_v3: ["shot"],
    family: "oo-to-o"
  },
  {
    id: 80, pack: 8,
    v1: "show", v2: "showed", v3: "shown",
    cat: "mostrar, ensenyar",
    p1: "/ʃəʊ/", p2: "/ʃəʊd/", p3: "/ʃəʊn/",
    accept_v2: ["showed"], accept_v3: ["shown"],
    family: "ed-en", tip: "Passat regular en -ed, però participi en -n: shown!"
  },

  // --- PACK 9 (81 - 90) ---
  {
    id: 81, pack: 9,
    v1: "shut", v2: "shut", v3: "shut",
    cat: "tancar",
    p1: "/ʃʌt/", p2: "/ʃʌt/", p3: "/ʃʌt/",
    accept_v2: ["shut"], accept_v3: ["shut"],
    family: "no-change"
  },
  {
    id: 82, pack: 9,
    v1: "sing", v2: "sang", v3: "sung",
    cat: "cantar",
    p1: "/sɪŋ/", p2: "/sæŋ/", p3: "/sʌŋ/",
    accept_v2: ["sang"], accept_v3: ["sung"],
    family: "i-a-u"
  },
  {
    id: 83, pack: 9,
    v1: "sink", v2: "sank", v3: "sunk",
    cat: "enfonsar-se",
    p1: "/sɪŋk/", p2: "/sæŋk/", p3: "/sʌŋk/",
    accept_v2: ["sank"], accept_v3: ["sunk"],
    family: "i-a-u"
  },
  {
    id: 84, pack: 9,
    v1: "sit", v2: "sat", v3: "sat",
    cat: "seure",
    p1: "/sɪt/", p2: "/sæt/", p3: "/sæt/",
    accept_v2: ["sat"], accept_v3: ["sat"],
    family: "i-to-a"
  },
  {
    id: 85, pack: 9,
    v1: "sleep", v2: "slept", v3: "slept",
    cat: "dormir",
    p1: "/sliːp/", p2: "/slept/", p3: "/slept/",
    accept_v2: ["slept"], accept_v3: ["slept"],
    family: "ee-to-e"
  },
  {
    id: 86, pack: 9,
    v1: "smell", v2: "smelt/smelled", v3: "smelt/smelled",
    cat: "olorar",
    p1: "/smel/", p2: "/smelt//smeld/", p3: "/smelt//smeld/",
    accept_v2: ["smelt", "smelled", "smelt/smelled"],
    accept_v3: ["smelt", "smelled", "smelt/smelled"],
    family: "t-or-ed"
  },
  {
    id: 87, pack: 9,
    v1: "speak", v2: "spoke", v3: "spoken",
    cat: "parlar",
    p1: "/spiːk/", p2: "/spəʊk/", p3: "/ˈspəʊkən/",
    accept_v2: ["spoke"], accept_v3: ["spoken"],
    family: "o-en"
  },
  {
    id: 88, pack: 9,
    v1: "spell", v2: "spelt/spelled", v3: "spelt/spelled",
    cat: "lletrejar",
    p1: "/spel/", p2: "/spelt//speld/", p3: "/spelt//speld/",
    accept_v2: ["spelt", "spelled", "spelt/spelled"],
    accept_v3: ["spelt", "spelled", "spelt/spelled"],
    family: "t-or-ed"
  },
  {
    id: 89, pack: 9,
    v1: "spend", v2: "spent", v3: "spent",
    cat: "gastar; passar (temps)",
    p1: "/spend/", p2: "/spent/", p3: "/spent/",
    accept_v2: ["spent"], accept_v3: ["spent"],
    family: "d-to-t"
  },
  {
    id: 90, pack: 9,
    v1: "spread", v2: "spread", v3: "spread",
    cat: "untar; difondre('s)",
    p1: "/spred/", p2: "/spred/", p3: "/spred/",
    accept_v2: ["spread"], accept_v3: ["spread"],
    family: "no-change"
  },

  // --- PACK 10 (91 - 100) ---
  {
    id: 91, pack: 10,
    v1: "stand", v2: "stood", v3: "stood",
    cat: "estar dret/a",
    p1: "/stænd/", p2: "/stʊd/", p3: "/stʊd/",
    accept_v2: ["stood"], accept_v3: ["stood"],
    family: "and-to-ood"
  },
  {
    id: 92, pack: 10,
    v1: "steal", v2: "stole", v3: "stolen",
    cat: "robar",
    p1: "/stiːl/", p2: "/stəʊl/", p3: "/ˈstəʊlən/",
    accept_v2: ["stole"], accept_v3: ["stolen"],
    family: "o-en"
  },
  {
    id: 93, pack: 10,
    v1: "stick", v2: "stuck", v3: "stuck",
    cat: "enganxar",
    p1: "/stɪk/", p2: "/stʌk/", p3: "/stʌk/",
    accept_v2: ["stuck"], accept_v3: ["stuck"],
    family: "i-to-u"
  },
  {
    id: 94, pack: 10,
    v1: "sting", v2: "stung", v3: "stung",
    cat: "picar (insecte)",
    p1: "/stɪŋ/", p2: "/stʌŋ/", p3: "/stʌŋ/",
    accept_v2: ["stung"], accept_v3: ["stung"],
    family: "i-to-u"
  },
  {
    id: 95, pack: 10,
    v1: "stink", v2: "stank", v3: "stunk",
    cat: "fer pudor",
    p1: "/stɪŋk/", p2: "/stæŋk/", p3: "/stʌŋk/",
    accept_v2: ["stank"], accept_v3: ["stunk"],
    family: "i-a-u"
  },
  {
    id: 96, pack: 10,
    v1: "sweep", v2: "swept", v3: "swept",
    cat: "escombrar",
    p1: "/swiːp/", p2: "/swept/", p3: "/swept/",
    accept_v2: ["swept"], accept_v3: ["swept"],
    family: "ee-to-e"
  },
  {
    id: 97, pack: 10,
    v1: "swim", v2: "swam", v3: "swum",
    cat: "nedar",
    p1: "/swɪm/", p2: "/swæm/", p3: "/swʌm/",
    accept_v2: ["swam"], accept_v3: ["swum"],
    family: "i-a-u"
  },
  {
    id: 98, pack: 10,
    v1: "take", v2: "took", v3: "taken",
    cat: "agafar; portar",
    p1: "/teɪk/", p2: "/tʊk/", p3: "/ˈteɪkən/",
    accept_v2: ["took"], accept_v3: ["taken"],
    family: "take-pattern"
  },
  {
    id: 99, pack: 10,
    v1: "teach", v2: "taught", v3: "taught",
    cat: "ensenyar",
    p1: "/tiːtʃ/", p2: "/tɔːt/", p3: "/tɔːt/",
    accept_v2: ["taught"], accept_v3: ["taught"],
    family: "ought-aught", tip: "Amb -aught (com catch -> caught)."
  },
  {
    id: 100, pack: 10,
    v1: "tear", v2: "tore", v3: "torn",
    cat: "esquinçar, estripar",
    p1: "/teə/", p2: "/tɔː/", p3: "/tɔːn/",
    accept_v2: ["tore"], accept_v3: ["torn"],
    family: "ear-ore-orn"
  },

  // --- PACK 11 (101 - 108) ---
  {
    id: 101, pack: 11,
    v1: "tell", v2: "told", v3: "told",
    cat: "dir, explicar",
    p1: "/tel/", p2: "/təʊld/", p3: "/təʊld/",
    accept_v2: ["told"], accept_v3: ["told"],
    family: "ell-to-old"
  },
  {
    id: 102, pack: 11,
    v1: "think", v2: "thought", v3: "thought",
    cat: "pensar",
    p1: "/θɪŋk/", p2: "/θɔːt/", p3: "/θɔːt/",
    accept_v2: ["thought"], accept_v3: ["thought"],
    family: "ought-aught"
  },
  {
    id: 103, pack: 11,
    v1: "throw", v2: "threw", v3: "thrown",
    cat: "llançar; llençar",
    p1: "/θrəʊ/", p2: "/θruː/", p3: "/θrəʊn/",
    accept_v2: ["threw"], accept_v3: ["thrown"],
    family: "ow-ew-own"
  },
  {
    id: 104, pack: 11,
    v1: "understand", v2: "understood", v3: "understood",
    cat: "comprendre, entendre",
    p1: "/ˌʌndəˈstænd/", p2: "/ˌʌndəˈstʊd/", p3: "/ˌʌndəˈstʊd/",
    accept_v2: ["understood"], accept_v3: ["understood"],
    family: "and-to-ood", tip: "Prefix under- + stand-stood-stood."
  },
  {
    id: 105, pack: 11,
    v1: "wake up", v2: "woke up", v3: "woken up",
    cat: "despertar(-se)",
    p1: "/weɪk ˈʌp/", p2: "/wəʊk ˈʌp/", p3: "/ˈwəʊkən ˈʌp/",
    accept_v2: ["woke up", "woke"],
    accept_v3: ["woken up", "woken"],
    family: "o-en"
  },
  {
    id: 106, pack: 11,
    v1: "wear", v2: "wore", v3: "worn",
    cat: "portar posat; posar-s'hi",
    p1: "/weə/", p2: "/wɔː/", p3: "/wɔːn/",
    accept_v2: ["wore"], accept_v3: ["worn"],
    family: "ear-ore-orn"
  },
  {
    id: 107, pack: 11,
    v1: "win", v2: "won", v3: "won",
    cat: "guanyar",
    p1: "/wɪn/", p2: "/wʌn/", p3: "/wʌn/",
    accept_v2: ["won"], accept_v3: ["won"],
    family: "i-to-o", tip: "Pronunciat igual que el número 'one' /wʌn/!"
  },
  {
    id: 108, pack: 11,
    v1: "write", v2: "wrote", v3: "written",
    cat: "escriure",
    p1: "/raɪt/", p2: "/rəʊt/", p3: "/ˈrɪtn/",
    accept_v2: ["wrote"], accept_v3: ["written"],
    family: "o-en", tip: "V3 s'escriu amb doble t: written."
  }
];

// Metadades dels Packs de 10
const PACKS_META = [
  { id: 1, title: "Pack 1: Be – Break", range: "1 - 10", count: 10, color: "from-blue-500 to-indigo-600", accent: "blue" },
  { id: 2, title: "Pack 2: Bring – Deal", range: "11 - 20", count: 10, color: "from-emerald-500 to-teal-600", accent: "emerald" },
  { id: 3, title: "Pack 3: Dig – Feel", range: "21 - 30", count: 10, color: "from-amber-500 to-orange-600", accent: "amber" },
  { id: 4, title: "Pack 4: Fight – Grow", range: "31 - 40", count: 10, color: "from-rose-500 to-pink-600", accent: "rose" },
  { id: 5, title: "Pack 5: Hang – Lay", range: "41 - 50", count: 10, color: "from-purple-500 to-violet-600", accent: "purple" },
  { id: 6, title: "Pack 6: Lead – Mean", range: "51 - 60", count: 10, color: "from-cyan-500 to-blue-600", accent: "cyan" },
  { id: 7, title: "Pack 7: Meet – Run", range: "61 - 70", count: 10, color: "from-fuchsia-500 to-pink-600", accent: "fuchsia" },
  { id: 8, title: "Pack 8: Say – Show", range: "71 - 80", count: 10, color: "from-lime-500 to-green-600", accent: "lime" },
  { id: 9, pack: 9, id: 9, title: "Pack 9: Shut – Spread", range: "81 - 90", count: 10, color: "from-orange-500 to-red-600", accent: "orange" },
  { id: 10, title: "Pack 10: Stand – Tear", range: "91 - 100", count: 10, color: "from-indigo-500 to-purple-600", accent: "indigo" },
  { id: 11, title: "Pack 11: Tell – Write", range: "101 - 108", count: 8, color: "from-yellow-500 to-amber-600", accent: "yellow" }
];

// Metadades dels Checkpoints Acumulatius
const CHECKPOINTS_META = [
  {
    id: 1,
    title: "Checkpoint 1 (Bronze)",
    subtitle: "Packs 1 – 2 (Verbs 1 a 20)",
    maxVerbs: 20,
    requiredScore: 80,
    badge: "🥉",
    name: "Explorador de Verbs",
    description: "Repàs acumulat des de 'be' fins a 'deal'.",
    color: "from-amber-600 to-amber-700"
  },
  {
    id: 2,
    title: "Checkpoint 2 (Plata)",
    subtitle: "Packs 1 – 4 (Verbs 1 a 40)",
    maxVerbs: 40,
    requiredScore: 80,
    badge: "🥈",
    name: "Guerrer Gramatical",
    description: "Repàs acumulat des de 'be' fins a 'grow'.",
    color: "from-slate-400 to-slate-600"
  },
  {
    id: 3,
    title: "Checkpoint 3 (Or)",
    subtitle: "Packs 1 – 6 (Verbs 1 a 60)",
    maxVerbs: 60,
    requiredScore: 80,
    badge: "🥇",
    name: "Campió d'Anglès",
    description: "Repàs acumulat des de 'be' fins a 'mean'. Superes la meitat!",
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: 4,
    title: "Checkpoint 4 (Platí)",
    subtitle: "Packs 1 – 8 (Verbs 1 a 80)",
    maxVerbs: 80,
    requiredScore: 80,
    badge: "💎",
    name: "Mestre de la Memòria",
    description: "Repàs acumulat des de 'be' fins a 'show'. Ja en domines 80!",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 5,
    title: "Checkpoint 5 (Diamant)",
    subtitle: "Packs 1 – 10 (Verbs 1 a 100)",
    maxVerbs: 100,
    requiredScore: 80,
    badge: "👑",
    name: "Gran Mestre dels Verbs",
    description: "Repàs acumulat fins a 100 verbs (des de 'be' fins a 'tear').",
    color: "from-purple-500 to-indigo-700"
  },
  {
    id: 6,
    title: "Checkpoint Final (Llegenda)",
    subtitle: "Packs 1 – 11 (Tots 108 verbs)",
    maxVerbs: 108,
    requiredScore: 85,
    badge: "🏆",
    name: "Llegenda de 2n d'ESO",
    description: "El repte definitiu: domini total de tots els 108 verbs del curs!",
    color: "from-rose-500 to-amber-500"
  }
];

// Metadades dels Jocs Finals amb tots els verbs
const ALL_VERBS_GAMES_META = [
  {
    id: "speedrun",
    title: "Contrarellotge (Speed Rush)",
    subtitle: "60 o 90 segons per fer el rècord màxim",
    badge: "⚡",
    color: "from-amber-500 to-red-500",
    description: "Posa a prova la teva velocitat de reacció! Com més ràpid responguis, més punts i ratxes acumules."
  },
  {
    id: "survival",
    title: "Mode Supervivència (3 Vides)",
    subtitle: "Fins on arribaràs sense fallar 3 vegades?",
    badge: "❤️",
    color: "from-rose-500 to-pink-600",
    description: "Comença tranquil i la dificultat puja! Tens 3 comodins (50/50, Saltar i 1a lletra)."
  },
  {
    id: "exam",
    title: "Simulacre d'Examen de 2n ESO",
    subtitle: "Genera un examen aleatori i descarrega/imprimeix l'informe",
    badge: "📝",
    color: "from-indigo-600 to-blue-700",
    description: "Com a classe: tria 10, 20 o 30 verbs, completa les caselles buides i obté la teva nota sobre 10."
  },
  {
    id: "wheel",
    title: "La Ruleta dels Verbs",
    subtitle: "Ideal per a la PDI de l'aula o pràctica individual",
    badge: "🎡",
    color: "from-purple-600 to-fuchsia-600",
    description: "Gira la ruleta, cau en un verb a l'atzar i resol el repte oral o escrit amb punts sorpresa."
  },
  {
    id: "explorer",
    title: "Diccionari & Cercador dels 108 Verbs",
    subtitle: "Amb àudio natiu, regles i filtres per famílies",
    badge: "📚",
    color: "from-teal-500 to-emerald-600",
    description: "Consulta les 3 formes, escolta com es pronuncien en anglès britànic i descobreix patrons comuns."
  }
];
