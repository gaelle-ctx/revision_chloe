import { useState } from "react";

// ============================================================
// LES TRAVAUX DE CHLOÉ — Révisions pour la 6ème
// Basé sur le bilan S2 CM2 : uniquement les points
// "non atteints" et "partiellement atteints".
// Pédagogie : pas de réponse révélée en cas d'erreur,
// un indice s'affiche et on réessaie.
// ============================================================

const QUESTIONS_PER_SESSION = 8;

// ---------- utilitaires ----------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const norm = (s) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/’/g, "'");
const sameNumber = (a, b) => {
  const pa = parseFloat(String(a).replace(",", "."));
  const pb = parseFloat(String(b).replace(",", "."));
  return !isNaN(pa) && !isNaN(pb) && Math.abs(pa - pb) < 0.0001;
};

// ---------- banques de questions fixes ----------

// Générateur : imparfait du 2ᵉ groupe (le point faible n°1 de Chloé — les DEUX S !)
const VERBES_2G = [
  { v: "finir", c: "nos devoirs" },
  { v: "grandir", c: "très vite" },
  { v: "choisir", c: "un livre à la bibliothèque" },
  { v: "rougir", c: "de plaisir" },
  { v: "réfléchir", c: "avant de répondre" },
  { v: "obéir", c: "aux consignes" },
  { v: "ralentir", c: "avant le virage" },
  { v: "applaudir", c: "les acteurs du spectacle" },
  { v: "nourrir", c: "les rapaces du parc" },
  { v: "bâtir", c: "une cabane dans le jardin" },
  { v: "remplir", c: "la gourde avant le départ" },
  { v: "réussir", c: "tous les exercices" },
  { v: "franchir", c: "la ligne d'arrivée" },
  { v: "guérir", c: "rapidement" },
  { v: "atterrir", c: "en douceur" },
  { v: "bondir", c: "de joie" },
  { v: "saisir", c: "la corde" },
  { v: "avertir", c: "les voisins" },
  { v: "gravir", c: "la montagne comme Hercule" },
  { v: "vieillir", c: "sans changer" },
];
const PRONOMS_2G = [
  { p: "je", t: "issais" },
  { p: "tu", t: "issais" },
  { p: "elle", t: "issait" },
  { p: "il", t: "issait" },
  { p: "nous", t: "issions" },
  { p: "vous", t: "issiez" },
  { p: "elles", t: "issaient" },
  { p: "ils", t: "issaient" },
];
function genImparfait2G(count) {
  return shuffle(VERBES_2G).slice(0, count).map(({ v, c }) => {
    const { p, t } = PRONOMS_2G[rand(0, PRONOMS_2G.length - 1)];
    const radical = v.slice(0, -2);
    const vowel = /^[aeiouéèh]/.test(v);
    const sujet = p === "je" && vowel ? "j'" : p + " ";
    return {
      type: "input",
      prompt: `Imparfait — (${v}) : ${sujet}______ ${c}.`,
      answer: radical + t,
      hint: `2ᵉ groupe : radical ${radical.toUpperCase()} + ISS + terminaison de « ${p} ». Les DEUX S sont obligatoires : ${radical}-iss-...`,
    };
  });
}

const CONJUGAISON = [
  { type: "input", prompt: "Imparfait — (chanter) : nous ______ en chœur.", answer: "chantions", hint: "1ᵉʳ groupe : radical CHANT + terminaison -ions pour « nous »." },
  { type: "input", prompt: "Imparfait — (manger) : je ______ une pomme.", answer: "mangeais", hint: "Attention : on garde le E après le G pour faire le son « je » → mang-e-ais." },
  { type: "input", prompt: "Imparfait — (lancer) : tu ______ le ballon.", answer: "lançais", hint: "Le C devient Ç devant le A pour garder le son « s » : lan-ç-ais." },
  { type: "input", prompt: "Passé composé — (finir) : elle a ______ son travail.", answer: "fini", hint: "Avec l'auxiliaire AVOIR, le participe passé de « finir » se termine par -i, sans accord." },
  { type: "input", prompt: "Passé composé — (prendre) : nous avons ______ le bus.", answer: "pris", hint: "« Prendre » a un participe passé irrégulier. Pense à : « le bus que j'ai pri... »" },
  { type: "input", prompt: "Passé composé — (partir) : elles sont ______ tôt.", answer: "parties", hint: "Avec l'auxiliaire ÊTRE, le participe passé s'accorde avec le sujet. « Elles » = féminin pluriel → -ies." },
  { type: "input", prompt: "Passé composé — (tomber) : elle est ______ dans la cour.", answer: "tombée", hint: "Auxiliaire ÊTRE → accord avec « elle » : féminin singulier, donc -ée." },
  { type: "input", prompt: "Passé composé — (voir) : j'ai ______ un rapace.", answer: "vu", hint: "Participe passé irrégulier de « voir », très court : 2 lettres seulement." },
  { type: "input", prompt: "Passé composé — (faire) : ils ont ______ du vélo.", answer: "fait", hint: "Participe passé irrégulier de « faire ». Avec AVOIR, pas d'accord avec le sujet." },
  {
    type: "mcq",
    prompt: "Dans quelle phrase le verbe est-il au FUTUR ?",
    options: ["Hercule combattait le lion.", "Hercule combattra le lion.", "Hercule a combattu le lion.", "Hercule combat le lion."],
    answer: "Hercule combattra le lion.",
    hint: "Le futur se reconnaît au R avant la terminaison : -rai, -ras, -ra, -rons, -rez, -ront.",
  },
  {
    type: "mcq",
    prompt: "Dans quelle phrase le verbe est-il au FUTUR ?",
    options: ["Nous irons au collège.", "Nous allions au collège.", "Nous sommes allés au collège.", "Nous allons au collège."],
    answer: "Nous irons au collège.",
    hint: "Cherche la terminaison en -rons : c'est la marque du futur avec « nous ».",
  },
];

const HOMOPHONES = [
  { type: "mcq", prompt: "Mon frère ___ parti à l'école.", options: ["et", "est"], answer: "est", hint: "Remplace par « était ». Si la phrase reste correcte, c'est le verbe être : EST." },
  { type: "mcq", prompt: "Chloé aime les chats ___ les chiens.", options: ["et", "est"], answer: "et", hint: "Remplace par « et puis ». Si ça marche, c'est ET." },
  { type: "mcq", prompt: "Elle ___ un vélo tout neuf.", options: ["a", "à"], answer: "a", hint: "Remplace par « avait ». Si la phrase reste correcte, c'est le verbe avoir : A sans accent." },
  { type: "mcq", prompt: "Nous allons ___ la piscine.", options: ["a", "à"], answer: "à", hint: "Essaie de remplacer par « avait ». Impossible ? Alors c'est À avec accent." },
  { type: "mcq", prompt: "Ils ___ gagné le match.", options: ["on", "ont"], answer: "ont", hint: "Remplace par « avaient ». Si ça marche, c'est ONT (verbe avoir)." },
  { type: "mcq", prompt: "___ frappe à la porte.", options: ["On", "Ont"], answer: "On", hint: "Remplace par « il ». Si ça marche, c'est ON." },
  { type: "mcq", prompt: "Mes cousines ___ arrivées hier.", options: ["son", "sont"], answer: "sont", hint: "Remplace par « étaient ». Si ça marche, c'est SONT (verbe être)." },
  { type: "mcq", prompt: "Il range ___ cartable.", options: ["son", "sont"], answer: "son", hint: "SON = le sien. On peut dire « le cartable de lui »." },
  { type: "mcq", prompt: "Les élèves rangent ___ affaires.", options: ["leur", "leurs"], answer: "leurs", hint: "« Affaires » est au pluriel → LEURS avec un S." },
  { type: "mcq", prompt: "Je ne sais pas ___ tu habites.", options: ["ou", "où"], answer: "où", hint: "OÙ avec accent indique un lieu. OU sans accent = un choix (fromage ou dessert)." },
  { type: "mcq", prompt: "Tu veux une pomme ___ une poire ?", options: ["ou", "où"], answer: "ou", hint: "Ici c'est un choix entre deux choses → OU sans accent (= ou bien)." },
  { type: "mcq", prompt: "___ chaussures sont trop petites.", options: ["Ces", "Ses", "C'est", "S'est"], answer: "Ces", hint: "On montre des chaussures : « ces chaussures-là ». CES = démonstratif." },
  { type: "mcq", prompt: "Il a perdu ___ clés.", options: ["ces", "ses", "c'est", "s'est"], answer: "ses", hint: "Les clés sont À LUI → SES (= les siennes)." },
  { type: "mcq", prompt: "___ une très bonne idée !", options: ["Ces", "Ses", "C'est", "S'est"], answer: "C'est", hint: "Remplace par « cela est ». Si ça marche → C'EST." },
  { type: "mcq", prompt: "Elle ___ blessée en tombant.", options: ["ces", "ses", "c'est", "s'est"], answer: "s'est", hint: "Suivi d'un participe passé (blessée) : elle S'EST blessée = verbe pronominal." },
  { type: "mcq", prompt: "___ soir, nous mangeons des crêpes.", options: ["Se", "Ce"], answer: "Ce", hint: "CE soir = ce soir-là (démonstratif). SE s'utilise devant un verbe : il SE lave." },
  { type: "mcq", prompt: "Le chat ___ cache sous le lit.", options: ["se", "ce"], answer: "se", hint: "SE + verbe (se cache, se lave, se promène) → SE." },
  { type: "mcq", prompt: "___ voiture est garée ___-bas.", options: ["La / là", "Là / la", "La / la", "Là / là"], answer: "La / là", hint: "LA + nom (la voiture). LÀ avec accent = un lieu (là-bas)." },
  { type: "mcq", prompt: "Elle a décidé de ______ son dessert.", options: ["manger", "mangé"], answer: "manger", hint: "Remplace par « prendre ». Si ça marche → infinitif en -ER." },
  { type: "mcq", prompt: "Le gâteau a été ______ en entier.", options: ["manger", "mangé"], answer: "mangé", hint: "Remplace par « pris ». Si ça marche → participe passé en -É." },
  { type: "mcq", prompt: "Il faut ______ avant de traverser.", options: ["regarder", "regardé"], answer: "regarder", hint: "Après « il faut », on met l'infinitif. Teste avec « prendre »." },
  { type: "mcq", prompt: "Chloé a ______ un poème magnifique.", options: ["réciter", "récité"], answer: "récité", hint: "Après l'auxiliaire AVOIR → participe passé. Teste avec « pris » : elle a pris... ✔" },
  { type: "mcq", prompt: "Le film ___ enfin terminé.", options: ["et", "est"], answer: "est", hint: "Remplace par « était ». Ça marche → verbe être : EST." },
  { type: "mcq", prompt: "Prends un stylo ___ une gomme.", options: ["et", "est"], answer: "et", hint: "Remplace par « et puis » : un stylo et puis une gomme ✔ → ET." },
  { type: "mcq", prompt: "Il pense ___ ses vacances en Grèce.", options: ["a", "à"], answer: "à", hint: "« Il pense avait ses vacances » ? Impossible → À avec accent." },
  { type: "mcq", prompt: "Elle ___ très faim ce midi.", options: ["a", "à"], answer: "a", hint: "« Elle avait très faim » ✔ → verbe avoir : A sans accent." },
  { type: "mcq", prompt: "Les Grecs ___ construit de magnifiques temples.", options: ["on", "ont"], answer: "ont", hint: "« Les Grecs avaient construit » ✔ → ONT." },
  { type: "mcq", prompt: "En été, ___ va souvent à la piscine.", options: ["on", "ont"], answer: "on", hint: "« En été, IL va à la piscine » ✔ → ON." },
  { type: "mcq", prompt: "Où ___ passées mes lunettes ?", options: ["son", "sont"], answer: "sont", hint: "« Où étaient passées mes lunettes » ✔ → SONT." },
  { type: "mcq", prompt: "Il prête ___ compas à sa voisine.", options: ["son", "sont"], answer: "son", hint: "SON compas = le sien. On peut dire « le compas de lui »." },
  { type: "mcq", prompt: "Je ___ raconte une histoire chaque soir.", options: ["leur", "leurs"], answer: "leur", hint: "Devant un VERBE, « leur » est un pronom : il ne prend JAMAIS de S (= à eux)." },
  { type: "mcq", prompt: "Ils promènent ___ chien au parc.", options: ["leur", "leurs"], answer: "leur", hint: "Un seul chien → « leur » reste au singulier, sans S." },
  { type: "mcq", prompt: "Elles ont oublié ___ manteaux au vestiaire.", options: ["leur", "leurs"], answer: "leurs", hint: "« Manteaux » est au pluriel → LEURS avec un S." },
  { type: "mcq", prompt: "Ce livre, elle ___ lu deux fois.", options: ["la", "là", "l'a", "l'as"], answer: "l'a", hint: "Remplace par « l'avait » : elle l'avait lu ✔ → L'A (le + verbe avoir)." },
  { type: "mcq", prompt: "Ce film, tu ___ déjà vu ?", options: ["la", "là", "l'a", "l'as"], answer: "l'as", hint: "Avec TU, le verbe avoir prend un S : tu l'AS vu (= tu l'avais vu)." },
  { type: "mcq", prompt: "Pose ton sac juste ___.", options: ["la", "là", "l'a", "l'as"], answer: "là", hint: "LÀ avec accent indique un LIEU : ici, là, là-bas." },
  { type: "mcq", prompt: "___ maîtresse explique la leçon.", options: ["La", "Là", "L'a", "L'as"], answer: "La", hint: "LA + nom (la maîtresse, la table) : c'est un article, sans accent." },
  { type: "mcq", prompt: "___ as-tu rangé ton cahier de maths ?", options: ["Ou", "Où"], answer: "Où", hint: "On demande un LIEU → OÙ avec accent." },
  { type: "mcq", prompt: "Tu préfères venir en bus ___ à vélo ?", options: ["ou", "où"], answer: "ou", hint: "C'est un choix (= ou bien) → OU sans accent." },
  { type: "mcq", prompt: "___ hier que nous sommes rentrés de vacances.", options: ["Ces", "Ses", "C'est", "S'est"], answer: "C'est", hint: "Remplace par « cela est » : cela est hier... ✔ → C'EST." },
  { type: "mcq", prompt: "Il ___ trompé de chemin dans le labyrinthe.", options: ["ces", "ses", "c'est", "s'est"], answer: "s'est", hint: "Suivi d'un participe passé (trompé) : il S'EST trompé." },
  { type: "mcq", prompt: "Regarde ___ nuages, il va pleuvoir !", options: ["ces", "ses", "c'est", "s'est"], answer: "ces", hint: "On MONTRE les nuages : ces nuages-là → démonstratif CES." },
  { type: "mcq", prompt: "Chloé range ___ crayons dans sa trousse.", options: ["ces", "ses", "c'est", "s'est"], answer: "ses", hint: "Les crayons sont À ELLE → SES (= les siens)." },
  { type: "mcq", prompt: "___ que je préfère, c'est la mythologie grecque.", options: ["Se", "Ce"], answer: "Ce", hint: "« Ce que », « ce qui » : toujours CE. SE ne s'utilise que devant un verbe." },
  { type: "mcq", prompt: "Ils ___ retrouvent au parc après l'école.", options: ["se", "ce"], answer: "se", hint: "SE + verbe (se retrouvent) → verbe pronominal → SE." },
  { type: "mcq", prompt: "Nous allons ______ le musée des Beaux-Arts.", options: ["visiter", "visité"], answer: "visiter", hint: "Après « aller », on met l'infinitif. Teste : nous allons PRENDRE ✔." },
  { type: "mcq", prompt: "Pour ______, il faut s'entraîner tous les jours.", options: ["gagner", "gagné"], answer: "gagner", hint: "Après « pour », toujours l'infinitif. Teste : pour PRENDRE ✔." },
  { type: "mcq", prompt: "Il a enfin ______ son exercice de fractions.", options: ["terminer", "terminé"], answer: "terminé", hint: "Après AVOIR → participe passé. Teste : il a PRIS ✔ → -É." },
  { type: "mcq", prompt: "Le poème doit être ______ devant toute la classe.", options: ["réciter", "récité"], answer: "récité", hint: "Après ÊTRE → participe passé. Teste : doit être PRIS ✔ → -É." },
];

const GRAMMAIRE = [
  { type: "mcq", prompt: "« Chloé écrit une lettre. » — Que représente « une lettre » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COD", hint: "Pose la question : Chloé écrit QUOI ? La réponse directe (sans petit mot) = COD." },
  { type: "mcq", prompt: "« Elle parle à sa sœur. » — Que représente « à sa sœur » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COI", hint: "Elle parle À QUI ? Il y a le petit mot « à » → complément d'objet INDIRECT." },
  { type: "mcq", prompt: "« Il offre un cadeau à son ami. » — Que représente « à son ami » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COS", hint: "Il y a déjà un COD (un cadeau). Le 2ᵉ complément avec « à » est le complément d'objet SECOND." },
  { type: "mcq", prompt: "« Hermès porte des sandales ailées. » — Que représente « des sandales ailées » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COD", hint: "Hermès porte QUOI ? Réponse directe, sans « à » ni « de » → COD." },
  { type: "mcq", prompt: "« Pense à ton exposé ! » — Que représente « à ton exposé » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COI", hint: "Pense À QUOI ? Le complément est relié par « à » → COI." },
  { type: "mcq", prompt: "Quel est le type de la phrase : « Range ta chambre immédiatement. »", options: ["Déclarative", "Impérative", "Interrogative"], answer: "Impérative", hint: "C'est un ordre, et le sujet n'est pas exprimé → phrase impérative." },
  { type: "mcq", prompt: "Quel est le type de la phrase : « Aimes-tu la mythologie ? »", options: ["Déclarative", "Impérative", "Interrogative"], answer: "Interrogative", hint: "Elle pose une question et se termine par un point d'interrogation." },
  { type: "mcq", prompt: "Quel est le type de la phrase : « Le Feuilleton d'Hermès raconte la mythologie. »", options: ["Déclarative", "Impérative", "Interrogative"], answer: "Déclarative", hint: "Elle donne simplement une information et se termine par un point." },
  { type: "mcq", prompt: "Quelle phrase négative est correctement écrite ?", options: ["Je n'ai pas fini.", "J'ai pas fini.", "Je nai pas fini.", "Je n'ai fini."], answer: "Je n'ai pas fini.", hint: "La négation a DEUX parties : NE (ou N') ... PAS, qui encadrent le verbe conjugué." },
  { type: "mcq", prompt: "Quelle est la forme négative de : « Il mange toujours des légumes. »", options: ["Il ne mange jamais de légumes.", "Il mange pas toujours des légumes.", "Il ne mange pas toujours légumes."], answer: "Il ne mange jamais de légumes.", hint: "Le contraire de « toujours » est « jamais » : ne ... jamais." },
  { type: "mcq", prompt: "À quoi sert le point d'interrogation ?", options: ["À poser une question", "À montrer la surprise", "À terminer un ordre", "À faire une pause"], answer: "À poser une question", hint: "On le trouve à la fin des phrases interrogatives." },
  { type: "mcq", prompt: "À quoi servent les deux-points ( : ) ?", options: ["À annoncer une explication ou une liste", "À terminer la phrase", "À poser une question", "À séparer deux paragraphes"], answer: "À annoncer une explication ou une liste", hint: "Ils annoncent ce qui suit : une liste, une explication ou des paroles." },
  { type: "mcq", prompt: "Quel signe encadre les paroles d'un personnage ?", options: ["Les guillemets « »", "Les parenthèses ( )", "Le point-virgule ;", "Les tirets seuls"], answer: "Les guillemets « »", hint: "Quand un personnage parle dans un récit, on ouvre et on ferme des guillemets." },
  { type: "mcq", prompt: "Accorde correctement : « Les héroïnes grecques sont très ______. »", options: ["courageuses", "courageuse", "courageux"], answer: "courageuses", hint: "« Héroïnes » = féminin pluriel → l'adjectif prend -es." },
  { type: "mcq", prompt: "Accorde correctement : « Mes petits frères ______ dans le jardin. »", options: ["jouent", "joue", "joues"], answer: "jouent", hint: "Le sujet « mes petits frères » = ils → terminaison -ent." },
  { type: "mcq", prompt: "« Persée coupe la tête de Méduse. » — Que représente « la tête de Méduse » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COD", hint: "Persée coupe QUOI ? Réponse directe, sans petit mot → COD." },
  { type: "mcq", prompt: "« Elle téléphone à sa grand-mère. » — Que représente « à sa grand-mère » ?", options: ["COI", "COD", "COS", "Sujet"], answer: "COI", hint: "Elle téléphone À QUI ? Un seul complément, relié par « à » → COI." },
  { type: "mcq", prompt: "« Le professeur explique la leçon aux élèves. » — Que représente « aux élèves » ?", options: ["COS", "COD", "COI", "Sujet"], answer: "COS", hint: "Il y a déjà un COD (la leçon). Le 2ᵉ complément avec « aux » = COS." },
  { type: "mcq", prompt: "« Nous regardons un documentaire sur les rapaces. » — Que représente « un documentaire sur les rapaces » ?", options: ["COD", "COI", "COS", "Sujet"], answer: "COD", hint: "Nous regardons QUOI ? Réponse directe → COD." },
  { type: "mcq", prompt: "Quel est le type de la phrase : « Prends ton goûter avant de partir. »", options: ["Impérative", "Déclarative", "Interrogative"], answer: "Impérative", hint: "C'est un ordre ou un conseil, sans sujet exprimé → impérative." },
  { type: "mcq", prompt: "Quel est le type de la phrase : « Quand partons-nous en vacances ? »", options: ["Interrogative", "Déclarative", "Impérative"], answer: "Interrogative", hint: "Le sujet est inversé (partons-NOUS) et il y a un « ? » → interrogative." },
  { type: "mcq", prompt: "Quelle est la forme négative de : « Elle voit quelqu'un dans la cour. »", options: ["Elle ne voit personne dans la cour.", "Elle voit pas quelqu'un dans la cour.", "Elle ne voit quelqu'un pas."], answer: "Elle ne voit personne dans la cour.", hint: "Le contraire de « quelqu'un » est « personne » : ne ... personne." },
  { type: "mcq", prompt: "Quelle phrase négative est correctement écrite ?", options: ["Nous n'avons rien compris.", "Nous avons rien compris.", "Nous n'avons rien pas compris."], answer: "Nous n'avons rien compris.", hint: "Deux mots pour la négation : N' ... RIEN. Jamais « rien » tout seul, jamais « rien pas »." },
  { type: "mcq", prompt: "À quoi sert la virgule ?", options: ["À faire une courte pause ou séparer les éléments d'une liste", "À terminer une phrase", "À poser une question", "À encadrer un dialogue"], answer: "À faire une courte pause ou séparer les éléments d'une liste", hint: "Exemple : « J'achète des pommes, des poires et des fraises. »" },
  { type: "mcq", prompt: "À quoi sert le point d'exclamation ?", options: ["À exprimer une émotion forte (surprise, joie, colère)", "À poser une question", "À annoncer une liste", "À séparer deux mots"], answer: "À exprimer une émotion forte (surprise, joie, colère)", hint: "« Quel spectacle magnifique ! » — on entend l'émotion dans la phrase." },
];

const GEOMETRIE = [
  { type: "mcq", prompt: "Quel quadrilatère a 4 côtés égaux ET 4 angles droits ?", options: ["Le carré", "Le rectangle", "Le losange", "Le parallélogramme"], answer: "Le carré", hint: "C'est le seul qui cumule les deux propriétés : côtés égaux + angles droits." },
  { type: "mcq", prompt: "Quelle est la propriété du LOSANGE ?", options: ["4 côtés de même longueur", "4 angles droits", "Un seul angle droit", "3 côtés égaux"], answer: "4 côtés de même longueur", hint: "Le losange a ses 4 côtés égaux, mais pas forcément d'angles droits (sinon c'est un carré !)." },
  { type: "mcq", prompt: "Quelle est la propriété du RECTANGLE ?", options: ["4 angles droits et côtés opposés égaux", "4 côtés égaux", "Aucun angle droit", "5 côtés"], answer: "4 angles droits et côtés opposés égaux", hint: "Pense à une porte : angles droits partout, et les côtés qui se font face sont de même longueur." },
  { type: "mcq", prompt: "Quelle est la propriété du PARALLÉLOGRAMME ?", options: ["Ses côtés opposés sont parallèles deux à deux", "Il a 4 angles droits", "Il a 4 côtés égaux", "Il a 3 sommets"], answer: "Ses côtés opposés sont parallèles deux à deux", hint: "Son nom l'indique : parallélo... = côtés PARALLÈLES deux à deux." },
  { type: "mcq", prompt: "Un triangle ISOCÈLE a...", options: ["2 côtés de même longueur", "3 côtés de même longueur", "Aucun côté égal", "Un angle droit obligatoire"], answer: "2 côtés de même longueur", hint: "ISO = égal. Deux de ses côtés sont égaux (et donc deux angles égaux aussi)." },
  { type: "mcq", prompt: "Un triangle ÉQUILATÉRAL a...", options: ["3 côtés de même longueur", "2 côtés de même longueur", "Un angle droit", "4 côtés"], answer: "3 côtés de même longueur", hint: "ÉQUI-LATÉRAL = côtés égaux... tous les trois !" },
  { type: "mcq", prompt: "Un triangle SCALÈNE a...", options: ["Trois côtés de longueurs différentes", "Deux côtés égaux", "Trois côtés égaux", "Toujours un angle droit"], answer: "Trois côtés de longueurs différentes", hint: "Le scalène est le triangle « quelconque » : aucun côté n'est égal à un autre." },
  { type: "mcq", prompt: "Un triangle RECTANGLE a...", options: ["Un angle droit", "Trois angles droits", "Trois côtés égaux", "Quatre sommets"], answer: "Un angle droit", hint: "Rectangle = angle droit. Un triangle rectangle possède UN angle de 90°." },
  { type: "mcq", prompt: "Comment s'appelle le segment qui relie deux sommets NON voisins d'un polygone ?", options: ["Une diagonale", "Un côté", "Un rayon", "Une médiane"], answer: "Une diagonale", hint: "Elle « traverse » la figure en diagonale, d'un sommet à un sommet opposé." },
  { type: "mcq", prompt: "Comment s'appelle le point où deux côtés d'un polygone se rejoignent ?", options: ["Un sommet", "Une diagonale", "Un angle plat", "Un centre"], answer: "Un sommet", hint: "C'est le « coin » de la figure, comme le sommet d'une montagne." },
  { type: "mcq", prompt: "Un polygone à 5 côtés s'appelle...", options: ["Un pentagone", "Un hexagone", "Un quadrilatère", "Un décagone"], answer: "Un pentagone", hint: "PENTA = 5 en grec (comme les 5 anneaux... non, ça c'est autre chose 😉). Hexa = 6." },
  { type: "mcq", prompt: "Un polygone à 6 côtés s'appelle...", options: ["Un hexagone", "Un pentagone", "Un octogone", "Un triangle"], answer: "Un hexagone", hint: "HEXA = 6 en grec. La France est surnommée l'Hexagone à cause de sa forme !" },
  { type: "mcq", prompt: "« Triangle ABC rectangle en B » : où se trouve l'angle droit ?", options: ["Au sommet B", "Au sommet A", "Au sommet C", "Au milieu du triangle"], answer: "Au sommet B", hint: "« Rectangle en B » veut dire que l'angle droit est AU SOMMET B. C'est pour ça qu'il faut bien nommer les sommets !" },
  { type: "mcq", prompt: "« Triangle EFG isocèle en E » : quels côtés sont égaux ?", options: ["EF et EG", "FG et EF", "FG et EG", "Aucun"], answer: "EF et EG", hint: "« Isocèle en E » : les deux côtés égaux partent du sommet E." },
  { type: "mcq", prompt: "Un quadrilatère est un polygone qui a...", options: ["4 côtés", "3 côtés", "5 côtés", "6 côtés"], answer: "4 côtés", hint: "QUADRI = 4 en latin. Carré, rectangle, losange... sont des quadrilatères." },
  { type: "mcq", prompt: "Un polygone à 8 côtés s'appelle...", options: ["Un octogone", "Un hexagone", "Un pentagone", "Un quadrilatère"], answer: "Un octogone", hint: "OCTO = 8, comme les 8 bras de la pieuvre (octopus) ! Les panneaux STOP sont des octogones." },
  { type: "mcq", prompt: "Quel outil utilise-t-on pour vérifier un angle droit ?", options: ["L'équerre", "Le compas", "La règle seule", "Le rapporteur uniquement"], answer: "L'équerre", hint: "L'équerre a un coin à 90° exactement : on le pose dans l'angle pour vérifier." },
  { type: "mcq", prompt: "Quel outil permet de tracer un cercle ou de reporter une longueur ?", options: ["Le compas", "L'équerre", "La gomme", "Le rapporteur"], answer: "Le compas", hint: "On pique sa pointe et on fait tourner... ou on garde son écartement pour reporter une longueur." },
  { type: "mcq", prompt: "Le carré est un rectangle particulier. Pourquoi ?", options: ["Il a 4 angles droits, comme le rectangle", "Il a 3 côtés", "Il n'a pas d'angle droit", "C'est faux, ce n'est pas un rectangle"], answer: "Il a 4 angles droits, comme le rectangle", hint: "Un rectangle = 4 angles droits. Le carré aussi ! Il a EN PLUS 4 côtés égaux." },
  { type: "mcq", prompt: "Pour tracer un triangle précis avec les bonnes mesures, on utilise...", options: ["La règle et le compas", "Seulement la gomme", "Seulement les doigts", "Le rapporteur seul"], answer: "La règle et le compas", hint: "La règle pour le premier côté, le compas pour reporter les longueurs des deux autres côtés." },
];

const SCIENCES = [
  { type: "mcq", prompt: "Quelle planète est la plus proche du Soleil ?", options: ["Mercure", "Vénus", "La Terre", "Mars"], answer: "Mercure", hint: "L'ordre : Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune. « Me Voici Tout Mouillé, J'ai Suivi Un Nuage »." },
  { type: "mcq", prompt: "Combien y a-t-il de planètes dans le système solaire ?", options: ["8", "9", "7", "12"], answer: "8", hint: "Depuis 2006, Pluton n'est plus une planète. Compte : Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune." },
  { type: "mcq", prompt: "Le Soleil est...", options: ["Une étoile", "Une planète", "Un satellite", "Une comète"], answer: "Une étoile", hint: "Il produit sa propre lumière et sa propre chaleur : c'est la définition d'une étoile." },
  { type: "mcq", prompt: "La Lune est...", options: ["Un satellite naturel", "Une planète", "Une étoile", "Un astéroïde"], answer: "Un satellite naturel", hint: "Elle tourne autour d'une planète (la Terre) : c'est la définition d'un satellite." },
  { type: "mcq", prompt: "Quel astre laisse une traînée lumineuse quand il s'approche du Soleil ?", options: ["Une comète", "Un astéroïde", "Une planète", "Un satellite"], answer: "Une comète", hint: "C'est une boule de glace et de poussière : en s'approchant du Soleil, sa glace s'évapore et forme une « queue »." },
  { type: "mcq", prompt: "Un astéroïde est...", options: ["Un gros rocher qui tourne autour du Soleil", "Une étoile filante", "Un satellite de la Terre", "Une petite étoile"], answer: "Un gros rocher qui tourne autour du Soleil", hint: "C'est un corps rocheux, bien plus petit qu'une planète. Beaucoup se trouvent entre Mars et Jupiter." },
  { type: "mcq", prompt: "Quel savant a affirmé que la Terre tourne autour du Soleil ?", options: ["Copernic", "Ptolémée", "Hercule", "Napoléon"], answer: "Copernic", hint: "Dans l'Antiquité, Ptolémée pensait que tout tournait autour de la Terre. Au XVIᵉ siècle, un astronome polonais a proposé le contraire." },
  { type: "mcq", prompt: "Quel savant a défendu les idées de Copernic grâce à sa lunette astronomique ?", options: ["Galilée", "Ptolémée", "Aristote", "Pasteur"], answer: "Galilée", hint: "Il est italien, il a observé le ciel avec une lunette et a été jugé pour ses idées." },
  { type: "mcq", prompt: "Le passage de l'état SOLIDE à l'état LIQUIDE s'appelle...", options: ["La fusion", "La solidification", "L'évaporation", "La condensation"], answer: "La fusion", hint: "C'est ce qui arrive au glaçon qui fond dans ton verre." },
  { type: "mcq", prompt: "Le passage de l'état LIQUIDE à l'état SOLIDE s'appelle...", options: ["La solidification", "La fusion", "La vaporisation", "La liquéfaction"], answer: "La solidification", hint: "C'est ce qui arrive à l'eau dans le congélateur : elle devient SOLIDE." },
  { type: "mcq", prompt: "Le passage de l'état LIQUIDE à l'état GAZEUX s'appelle...", options: ["La vaporisation (évaporation)", "La fusion", "La solidification", "La condensation"], answer: "La vaporisation (évaporation)", hint: "C'est ce qui arrive à la flaque d'eau qui « disparaît » au soleil : elle devient VAPEUR." },
  { type: "mcq", prompt: "La buée sur une vitre froide, c'est de la vapeur d'eau qui...", options: ["Se condense (redevient liquide)", "Fond", "Se solidifie", "Disparaît"], answer: "Se condense (redevient liquide)", hint: "La vapeur (gaz) touche la vitre froide et redevient de petites gouttes : gaz → liquide." },
  { type: "mcq", prompt: "Quelle planète est surnommée « la planète rouge » ?", options: ["Mars", "Vénus", "Jupiter", "Mercure"], answer: "Mars", hint: "C'est la 4ᵉ planète en partant du Soleil. Sa couleur vient de la rouille (oxyde de fer) de son sol !" },
  { type: "mcq", prompt: "Quelle est la plus GRANDE planète du système solaire ?", options: ["Jupiter", "La Terre", "Saturne", "Neptune"], answer: "Jupiter", hint: "C'est une géante gazeuse : on pourrait y ranger plus de 1 300 Terres !" },
  { type: "mcq", prompt: "Quelle planète est célèbre pour ses grands anneaux ?", options: ["Saturne", "Mars", "Mercure", "La Terre"], answer: "Saturne", hint: "Ses anneaux sont faits de milliards de morceaux de glace et de roche." },
  { type: "mcq", prompt: "Une « étoile filante », c'est en réalité...", options: ["Un petit caillou qui brûle en entrant dans l'atmosphère", "Une vraie étoile qui tombe", "Une planète très rapide", "Un satellite artificiel"], answer: "Un petit caillou qui brûle en entrant dans l'atmosphère", hint: "Ce n'est pas une étoile du tout ! C'est une poussière de l'espace qui s'enflamme dans notre ciel." },
  { type: "mcq", prompt: "Dans l'Antiquité, Ptolémée pensait que...", options: ["La Terre était au centre et tout tournait autour d'elle", "Le Soleil était au centre", "La Terre était plate comme une crêpe", "La Lune était une étoile"], answer: "La Terre était au centre et tout tournait autour d'elle", hint: "C'est le modèle « géocentrique » (géo = Terre). Copernic a montré le contraire bien plus tard." },
  { type: "mcq", prompt: "Un glaçon oublié sur la table : quel changement d'état se produit ?", options: ["Solide → liquide (fusion)", "Liquide → solide", "Liquide → gaz", "Gaz → liquide"], answer: "Solide → liquide (fusion)", hint: "Le glaçon (solide) devient de l'eau (liquide) : il FOND, c'est la fusion." },
  { type: "mcq", prompt: "L'eau qui bout dans la casserole se transforme en...", options: ["Vapeur d'eau (gaz)", "Glace", "Neige", "Rien, elle disparaît"], answer: "Vapeur d'eau (gaz)", hint: "À 100 °C, l'eau liquide se vaporise : elle devient un gaz invisible, la vapeur d'eau." },
];

const HISTOIRE = [
  { type: "mcq", prompt: "Que s'est-il passé le 14 juillet 1789 ?", options: ["La prise de la Bastille", "Le sacre de Napoléon", "La bataille de Waterloo", "L'exécution du roi"], answer: "La prise de la Bastille", hint: "Les Parisiens attaquent une prison-forteresse, symbole du pouvoir du roi. C'est devenu notre fête nationale !" },
  { type: "mcq", prompt: "En quelle année commence la Révolution française ?", options: ["1789", "1804", "1715", "1815"], answer: "1789", hint: "La même année que la prise de la Bastille. Retiens : 1-7-8-9, les chiffres se suivent presque !" },
  { type: "mcq", prompt: "Quel texte célèbre est adopté le 26 août 1789 ?", options: ["La Déclaration des droits de l'homme et du citoyen", "Le Code civil", "La Constitution de la Vᵉ République", "Le traité de Versailles"], answer: "La Déclaration des droits de l'homme et du citoyen", hint: "« Les hommes naissent et demeurent libres et égaux en droits » : c'est sa première phrase." },
  { type: "mcq", prompt: "Avant 1789, la société d'Ancien Régime était divisée en trois...", options: ["Ordres (clergé, noblesse, tiers état)", "Régions", "Empires", "Républiques"], answer: "Ordres (clergé, noblesse, tiers état)", hint: "Ceux qui prient, ceux qui combattent... et le tiers état qui paie presque tous les impôts !" },
  { type: "mcq", prompt: "Qu'arrive-t-il au roi Louis XVI en janvier 1793 ?", options: ["Il est guillotiné", "Il devient empereur", "Il s'enfuit en Amérique", "Il gagne une bataille"], answer: "Il est guillotiné", hint: "Après la chute de la monarchie en 1792, le roi est jugé puis condamné à mort." },
  { type: "mcq", prompt: "En quelle année la Première République est-elle proclamée ?", options: ["1792", "1789", "1804", "1870"], answer: "1792", hint: "Trois ans après la prise de la Bastille, la monarchie est abolie." },
  { type: "mcq", prompt: "Que se passe-t-il le 2 décembre 1804 ?", options: ["Napoléon se fait sacrer empereur", "La prise de la Bastille", "La Révolution commence", "Louis XVI est jugé"], answer: "Napoléon se fait sacrer empereur", hint: "La cérémonie a lieu à Notre-Dame de Paris. Il pose lui-même la couronne sur sa tête !" },
  { type: "mcq", prompt: "Quel grand recueil de lois créé par Napoléon existe toujours aujourd'hui ?", options: ["Le Code civil", "La Déclaration des droits", "Le Code de la route", "La Charte de 1789"], answer: "Le Code civil", hint: "Créé en 1804, il rassemble les lois qui organisent la vie des citoyens (famille, propriété...). On l'utilise encore !" },
  { type: "mcq", prompt: "Parmi ces créations de Napoléon, laquelle existe encore de nos jours ?", options: ["Les lycées et la Légion d'honneur", "Les châteaux forts", "Les ordres de l'Ancien Régime", "La monarchie absolue"], answer: "Les lycées et la Légion d'honneur", hint: "Napoléon a créé les lycées pour former les futurs cadres du pays, et une décoration pour récompenser les mérites." },
  { type: "mcq", prompt: "Quelle bataille marque la défaite finale de Napoléon en 1815 ?", options: ["Waterloo", "Austerlitz", "Marignan", "Alésia"], answer: "Waterloo", hint: "Elle a lieu en Belgique. Austerlitz (1805) était au contraire sa plus grande victoire." },
  { type: "mcq", prompt: "Pour analyser un document historique, que fait-on EN PREMIER ?", options: ["On identifie sa nature, son auteur et sa date", "On recopie tout le texte", "On invente la suite", "On le colorie"], answer: "On identifie sa nature, son auteur et sa date", hint: "Qui l'a fait ? Quand ? Qu'est-ce que c'est (tableau, lettre, affiche...) ? C'est la carte d'identité du document." },
  { type: "mcq", prompt: "Ce tableau montre un sacre dans une cathédrale, peint par David en 1807. De quel événement s'agit-il ?", options: ["Le sacre de Napoléon", "La prise de la Bastille", "Le baptême de Clovis", "La Fête de la Fédération"], answer: "Le sacre de Napoléon", hint: "1807, c'est juste après 1804... et David était le peintre officiel de l'empereur." },
  { type: "mcq", prompt: "Qui était roi de France quand la Révolution a éclaté en 1789 ?", options: ["Louis XVI", "Louis XIV", "Napoléon", "Henri IV"], answer: "Louis XVI", hint: "C'est le roi marié à Marie-Antoinette, celui qui sera guillotiné en 1793." },
  { type: "mcq", prompt: "Le 20 juin 1789, les députés font le serment du Jeu de paume. Que jurent-ils ?", options: ["De donner une Constitution à la France", "De couronner Napoléon", "De reconstruire la Bastille", "De partir en Amérique"], answer: "De donner une Constitution à la France", hint: "Réunis dans une salle de jeu de paume, ils jurent de ne pas se séparer avant d'avoir écrit une Constitution." },
  { type: "mcq", prompt: "Que se passe-t-il pendant la nuit du 4 août 1789 ?", options: ["L'abolition des privilèges", "La prise de la Bastille", "Le sacre de Napoléon", "La bataille de Waterloo"], answer: "L'abolition des privilèges", hint: "Les nobles et le clergé renoncent à leurs avantages : tous les Français deviennent égaux devant l'impôt." },
  { type: "mcq", prompt: "En juin 1791, la famille royale tente de fuir la France. Où est-elle arrêtée ?", options: ["À Varennes", "À Marseille", "À Waterloo", "À Rome"], answer: "À Varennes", hint: "Le roi est reconnu grâce à son portrait sur une pièce de monnaie ! Cette fuite ruine sa popularité." },
  { type: "mcq", prompt: "Napoléon crée les « préfets ». Quel est leur rôle ?", options: ["Diriger les départements au nom de l'État", "Commander les navires", "Enseigner dans les lycées", "Peindre les tableaux officiels"], answer: "Diriger les départements au nom de l'État", hint: "Un préfet par département, pour appliquer partout les décisions de l'État. Ils existent toujours aujourd'hui !" },
  { type: "mcq", prompt: "La Marseillaise, notre hymne national, a été composée...", options: ["En 1792, pendant la Révolution", "Sous Louis XIV", "Par Napoléon en 1804", "Au Moyen Âge"], answer: "En 1792, pendant la Révolution", hint: "C'est un chant de guerre révolutionnaire, chanté par les volontaires de Marseille en montant à Paris." },
  { type: "mcq", prompt: "En 1805, Napoléon remporte sa plus célèbre victoire. Laquelle ?", options: ["Austerlitz", "Waterloo", "Alésia", "Marignan"], answer: "Austerlitz", hint: "On l'appelle « la bataille des Trois Empereurs ». Waterloo (1815), c'est au contraire sa défaite finale." },
];

const POINT_DE_VUE = [
  { type: "mcq", prompt: "« Je m'appelle Hercule et je dois accomplir douze travaux. » — Qui raconte ?", options: ["Hercule lui-même (1ʳᵉ personne)", "Un narrateur extérieur", "Zeus", "Le lecteur"], answer: "Hercule lui-même (1ʳᵉ personne)", hint: "Le mot « JE » indique que le personnage raconte sa propre histoire." },
  { type: "mcq", prompt: "Réécris à la 3ᵉ personne : « Je pars combattre le lion. » →", options: ["Il part combattre le lion.", "Je partais combattre le lion.", "Tu pars combattre le lion.", "Nous partons combattre le lion."], answer: "Il part combattre le lion.", hint: "Changer de point de vue : JE devient IL, et le verbe s'accorde avec « il »." },
  { type: "mcq", prompt: "« Le loup vit une fillette au chaperon rouge. Elle avait l'air délicieuse... » — Quel est ce point de vue ?", options: ["Celui du loup", "Celui du chaperon rouge", "Celui de la grand-mère", "Celui du chasseur"], answer: "Celui du loup", hint: "Qui trouve la fillette « délicieuse » ? Ce sont les pensées du loup qu'on lit !" },
  { type: "mcq", prompt: "Pour raconter la même scène du point de vue du chaperon rouge, on écrirait :", options: ["« J'aperçus un loup énorme et j'eus très peur. »", "« Le loup avait très faim. »", "« Miam, un bon repas ! pensa le loup. »", "« Le chasseur dormait. »"], answer: "« J'aperçus un loup énorme et j'eus très peur. »", hint: "Du point de vue du chaperon rouge : c'est ELLE qui parle (je) et ce sont SES émotions (la peur)." },
  { type: "mcq", prompt: "Changer de point de vue dans un récit, c'est...", options: ["Raconter la même histoire à travers les yeux d'un autre personnage", "Changer la fin de l'histoire", "Écrire plus vite", "Ajouter des personnages"], answer: "Raconter la même histoire à travers les yeux d'un autre personnage", hint: "Même histoire, mais on change de « paire de lunettes » : un autre personnage raconte ce qu'il voit et ressent." },
  { type: "mcq", prompt: "Réécris du point de vue de Chloé : « Chloé récita son poème devant la classe. » →", options: ["« Je récitai mon poème devant la classe. »", "« Elle récita son poème. »", "« Tu récitas ton poème. »", "« Chloé récite un poème. »"], answer: "« Je récitai mon poème devant la classe. »", hint: "Point de vue de Chloé = elle raconte : « Chloé » devient « je » et « son » devient « mon »." },
  { type: "mcq", prompt: "Réécris à la 3ᵉ personne du pluriel : « Nous partons en voyage. » →", options: ["« Ils partent en voyage. »", "« Il part en voyage. »", "« Vous partez en voyage. »", "« Je pars en voyage. »"], answer: "« Ils partent en voyage. »", hint: "NOUS (plusieurs personnes) devient ILS ou ELLES, et le verbe prend -ent." },
  { type: "mcq", prompt: "Quand le narrateur dit « je », c'est que...", options: ["Un personnage de l'histoire raconte lui-même", "L'auteur a oublié un mot", "L'histoire est forcément vraie", "Le lecteur est le héros"], answer: "Un personnage de l'histoire raconte lui-même", hint: "Le récit à la 1ʳᵉ personne : on voit l'histoire à travers les yeux de celui qui dit « je »." },
  { type: "mcq", prompt: "Cendrillon racontée par la belle-mère commencerait par...", options: ["« Cette petite ne m'a jamais obéi, quelle ingrate ! »", "« J'étais une pauvre orpheline maltraitée. »", "« Il était une fois un prince. »", "« Ma marraine la fée m'aida. »"], answer: "« Cette petite ne m'a jamais obéi, quelle ingrate ! »", hint: "Du point de vue de la belle-mère : c'est ELLE qui parle, avec SON opinion (même injuste !) sur Cendrillon." },
  { type: "mcq", prompt: "Le Minotaure raconte : « On m'a enfermé dans ce labyrinthe, je suis si seul... » — Qu'apporte ce changement de point de vue ?", options: ["On découvre les émotions du monstre, il devient touchant", "L'histoire change complètement de fin", "Thésée devient le narrateur", "Rien ne change"], answer: "On découvre les émotions du monstre, il devient touchant", hint: "Changer de point de vue fait découvrir ce que ressent un personnage... même le « méchant » de l'histoire !" },
];

// ---------- générateurs de questions maths ----------

function genCalculMental() {
  const qs = [];
  for (let i = 0; i < 4; i++) {
    const n = rand(1, 499) * 2; // pair
    qs.push({ type: "input", prompt: `Calcule la MOITIÉ de ${n}.`, answer: String(n / 2), numeric: true, hint: `La moitié, c'est diviser par 2. Astuce : moitié de ${n} = moitié de ${Math.floor(n / 100) * 100} + moitié de ${n - Math.floor(n / 100) * 100}.` });
  }
  for (let i = 0; i < 3; i++) {
    const n = rand(6, 99);
    qs.push({ type: "input", prompt: `Calcule : ${n} × 9`, answer: String(n * 9), numeric: true, hint: `Astuce : ${n} × 9 = ${n} × 10 − ${n} = ${n * 10} − ${n}.` });
  }
  for (let i = 0; i < 3; i++) {
    const n = rand(6, 99);
    qs.push({ type: "input", prompt: `Calcule : ${n} × 11`, answer: String(n * 11), numeric: true, hint: `Astuce : ${n} × 11 = ${n} × 10 + ${n} = ${n * 10} + ${n}.` });
  }
  for (let i = 0; i < 3; i++) {
    const n = rand(6, 60);
    qs.push({ type: "input", prompt: `Calcule : ${n} × 12`, answer: String(n * 12), numeric: true, hint: `Astuce : ${n} × 12 = ${n} × 10 + ${n} × 2 = ${n * 10} + ${n * 2}.` });
  }
  return shuffle(qs);
}

function genMultiplicationPosee() {
  const qs = [];
  for (let i = 0; i < 5; i++) {
    const a = rand(24, 99);
    const b = rand(12, 99);
    qs.push({ type: "input", prompt: `Pose et calcule sur ton cahier : ${a} × ${b}`, answer: String(a * b), numeric: true, hint: `Décompose : ${a} × ${b} = ${a} × ${Math.floor(b / 10) * 10} + ${a} × ${b % 10}. N'oublie pas le zéro (ou le décalage) sur la 2ᵉ ligne !` });
  }
  for (let i = 0; i < 4; i++) {
    const a = rand(23, 89);
    const b = rand(102, 399);
    qs.push({ type: "input", prompt: `Pose et calcule sur ton cahier : ${a} × ${b}`, answer: String(a * b), numeric: true, hint: `Trois lignes : ${a} × ${b % 10}, puis ${a} × ${Math.floor((b % 100) / 10)} dizaines (1 zéro), puis ${a} × ${Math.floor(b / 100)} centaines (2 zéros). Additionne le tout.` });
  }
  return shuffle(qs);
}

function genFractions() {
  const qs = [];
  // 1) Placer une fraction sur une droite graduée (le cas difficile de Chloé :
  //    la graduation ne correspond pas toujours au dénominateur)
  const configs = [
    { d: 2, g: 4 }, { d: 4, g: 8 }, { d: 3, g: 6 }, { d: 5, g: 10 }, { d: 4, g: 4 }, { d: 2, g: 6 },
  ];
  shuffle(configs).slice(0, 4).forEach(({ d, g }) => {
    const n = rand(1, 2 * d - 1); // fraction entre 0 et 2
    const correctPos = (n * g) / d; // en graduations
    const positions = new Set([correctPos]);
    while (positions.size < 4) {
      const p = rand(1, 2 * g - 1);
      positions.add(p);
    }
    const pts = shuffle([...positions]).map((pos, i) => ({ label: "ABCD"[i], pos }));
    const correctLabel = pts.find((p) => p.pos === correctPos).label;
    qs.push({
      type: "mcq",
      prompt: `Quel point correspond à la fraction ${n}/${d} ?`,
      options: pts.map((p) => `Point ${p.label}`).sort(),
      answer: `Point ${correctLabel}`,
      hint: d === g
        ? `L'unité est partagée en ${g} : chaque graduation vaut 1/${d}. Compte ${n} graduations depuis 0.`
        : `Attention : l'unité est partagée en ${g} parts, pas en ${d} ! Chaque graduation vaut 1/${g}, donc 1/${d} = ${g / d}/${g}. Pour ${n}/${d}, compte ${correctPos} graduations depuis 0.`,
      numberLine: { g, units: 2, points: pts },
    });
  });
  // 2) Décomposer en entier + fraction < 1
  for (let i = 0; i < 3; i++) {
    const d = [3, 4, 5][rand(0, 2)];
    const entier = rand(1, 3);
    const reste = rand(1, d - 1);
    const n = entier * d + reste;
    qs.push({
      type: "mcq",
      prompt: `Décompose ${n}/${d} en un nombre entier + une fraction inférieure à 1 :`,
      options: shuffle([
        `${entier} + ${reste}/${d}`,
        `${entier + 1} + ${reste}/${d}`,
        `${entier} + ${d}/${reste}`,
        `${reste} + ${entier}/${d}`,
      ]),
      answer: `${entier} + ${reste}/${d}`,
      hint: `Combien de fois ${d}/${d} (= 1 unité entière) dans ${n}/${d} ? ${d} × ${entier} = ${entier * d}, et il reste ${reste}/${d}.`,
    });
  }
  // 3) Fraction décimale → nombre à virgule
  for (let i = 0; i < 3; i++) {
    const mode = rand(0, 1);
    if (mode === 0) {
      const n = rand(11, 99);
      qs.push({ type: "input", prompt: `Écris ${n}/10 sous forme de nombre à virgule :`, answer: String(n / 10).replace(".", ","), numeric: true, hint: `${n}/10 = ${n} dixièmes. La virgule se place avant le dernier chiffre : ${Math.floor(n / 10)} unités et ${n % 10} dixième(s).` });
    } else {
      const n = rand(101, 999);
      qs.push({ type: "input", prompt: `Écris ${n}/100 sous forme de nombre à virgule :`, answer: String(n / 100).replace(".", ","), numeric: true, hint: `${n}/100 = ${n} centièmes. La virgule se place avant les DEUX derniers chiffres.` });
    }
  }
  return shuffle(qs);
}

// ---------- droite graduée SVG ----------
function NumberLine({ data }) {
  const { g, units, points } = data;
  const W = 560, H = 90, pad = 30;
  const total = units * g;
  const step = (W - 2 * pad) / total;
  const x = (k) => pad + k * step;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto my-3">
      <line x1={pad - 10} y1={55} x2={W - pad + 10} y2={55} stroke="#1e3a5f" strokeWidth="2.5" />
      {Array.from({ length: total + 1 }, (_, k) => {
        const isUnit = k % g === 0;
        return (
          <g key={k}>
            <line x1={x(k)} y1={isUnit ? 44 : 49} x2={x(k)} y2={isUnit ? 66 : 61} stroke="#1e3a5f" strokeWidth={isUnit ? 2.5 : 1.5} />
            {isUnit && (
              <text x={x(k)} y={82} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1e3a5f">{k / g}</text>
            )}
          </g>
        );
      })}
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={x(p.pos)} cy={55} r={5.5} fill="#c2410c" />
          <text x={x(p.pos)} y={32} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#c2410c">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ---------- définition des missions ----------
const MISSIONS = [
  { id: "conjugaison", icon: "🦁", title: "Le Lion de la Conjugaison", sub: "Imparfait (les 2 S !), passé composé, accords", bank: () => shuffle([...genImparfait2G(3), ...shuffle(CONJUGAISON).slice(0, QUESTIONS_PER_SESSION - 3)]) },
  { id: "homophones", icon: "🐍", title: "L'Hydre des Homophones", sub: "et/est, a/à, son/sont, ces/ses, -er/-é...", bank: () => shuffle(HOMOPHONES) },
  { id: "grammaire", icon: "🦌", title: "La Biche de la Grammaire", sub: "COD/COI/COS, types de phrases, négation, ponctuation", bank: () => shuffle(GRAMMAIRE) },
  { id: "pointdevue", icon: "🎭", title: "Le Masque du Narrateur", sub: "Écrire en changeant de point de vue", bank: () => shuffle(POINT_DE_VUE) },
  { id: "calcul", icon: "⚡", title: "Les Éclairs du Calcul", sub: "Moitiés, ×9, ×11, ×12", bank: genCalculMental },
  { id: "multiplication", icon: "🏛️", title: "Les Colonnes de la Multiplication", sub: "Multiplication posée à 2 et 3 chiffres", bank: genMultiplicationPosee },
  { id: "fractions", icon: "🍕", title: "Le Festin des Fractions", sub: "Droite graduée, décomposition, écriture décimale", bank: genFractions },
  { id: "geometrie", icon: "📐", title: "Le Labyrinthe de Géométrie", sub: "Triangles, quadrilatères et leurs propriétés", bank: () => shuffle(GEOMETRIE) },
  { id: "sciences", icon: "🪐", title: "Le Voyage dans les Étoiles", sub: "Système solaire, objets célestes, états de la matière", bank: () => shuffle(SCIENCES) },
  { id: "histoire", icon: "🗡️", title: "Le Temps des Révolutions", sub: "1789, la Révolution et Napoléon", bank: () => shuffle(HISTOIRE) },
];

const PRAISE = ["Bravo Chloé ! 🌟", "Excellent ! 💪", "Parfait ! ✨", "Tu assures ! 🎉", "Magnifique ! 🏆", "Quelle championne ! ⭐"];
const RETRY = ["Pas tout à fait... lis l'indice ! 🔍", "Presque ! Regarde l'indice. 💡", "Réessaie avec cet indice ! 🧭"];

// ---------- composant principal ----------
export default function RevisionsChloe() {
  const [screen, setScreen] = useState("home");
  const [mission, setMission] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null); // {ok, msg}
  const [showHint, setShowHint] = useState(false);
  const [firstTry, setFirstTry] = useState(true);
  const [score, setScore] = useState(0);
  const [laurels, setLaurels] = useState({});
  const [solved, setSolved] = useState(false);

  const startMission = (m) => {
    setMission(m);
    setQuestions(m.bank().slice(0, QUESTIONS_PER_SESSION));
    setIdx(0);
    setScore(0);
    setInput("");
    setFeedback(null);
    setShowHint(false);
    setFirstTry(true);
    setSolved(false);
    setScreen("quiz");
  };

  const q = questions[idx];

  const check = (given) => {
    if (solved) return;
    const ok = q.numeric ? sameNumber(given, q.answer) : norm(given) === norm(q.answer);
    if (ok) {
      if (firstTry) setScore((s) => s + 1);
      setFeedback({ ok: true, msg: PRAISE[rand(0, PRAISE.length - 1)] });
      setSolved(true);
      setShowHint(false);
    } else {
      setFeedback({ ok: false, msg: RETRY[rand(0, RETRY.length - 1)] });
      setShowHint(true);
      setFirstTry(false);
    }
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      const earned = score >= Math.ceil(questions.length * 0.75);
      if (earned) setLaurels((l) => ({ ...l, [mission.id]: true }));
      setScreen("end");
    } else {
      setIdx(idx + 1);
      setInput("");
      setFeedback(null);
      setShowHint(false);
      setFirstTry(true);
      setSolved(false);
    }
  };

  // ---------- écran d'accueil ----------
  if (screen === "home") {
    const count = Object.keys(laurels).length;
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-50 p-4 sm:p-8" style={{ fontFamily: "Georgia, serif" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🏺</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-wide">Les Travaux de Chloé</h1>
            <p className="text-blue-800 mt-2 text-lg">Mes missions de révision avant la 6ème</p>
            <div className="mt-3 inline-block bg-white/70 rounded-full px-4 py-1 text-amber-700 font-semibold shadow-sm">
              🌿 Lauriers gagnés : {count} / {MISSIONS.length}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {MISSIONS.map((m) => (
              <button
                key={m.id}
                onClick={() => startMission(m)}
                className="text-left bg-white rounded-2xl p-4 shadow-md border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 flex items-center gap-2">
                      {m.title}
                      {laurels[m.id] && <span title="Laurier gagné !">🌿</span>}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{m.sub}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            Réussis 6 questions sur 8 du premier coup pour gagner la couronne de laurier 🌿 de chaque mission !
          </p>
        </div>
      </div>
    );
  }

  // ---------- écran de fin ----------
  if (screen === "end") {
    const earned = laurels[mission.id];
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-50 flex items-center justify-center p-6" style={{ fontFamily: "Georgia, serif" }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-4 border-amber-200">
          <div className="text-6xl mb-3">{earned ? "🌿" : "💪"}</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            {earned ? "Mission accomplie !" : "Bel entraînement !"}
          </h2>
          <p className="text-lg text-slate-700 mb-1">
            Score du premier coup : <span className="font-bold text-amber-700">{score} / {questions.length}</span>
          </p>
          <p className="text-slate-600 mb-6">
            {earned
              ? "Tu as gagné la couronne de laurier ! Même Hercule serait fier de toi."
              : "Recommence cette mission pour décrocher la couronne de laurier, tu y es presque !"}
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => startMission(mission)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow transition-colors">
              🔄 Refaire cette mission
            </button>
            <button onClick={() => setScreen("home")} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-xl shadow transition-colors">
              🏺 Retour aux missions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- écran de quiz ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-50 p-4 sm:p-8" style={{ fontFamily: "Georgia, serif" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setScreen("home")} className="text-blue-800 font-semibold hover:underline">← Missions</button>
          <div className="text-sm font-semibold text-slate-600">
            Question {idx + 1} / {questions.length} · ⭐ {score}
          </div>
        </div>

        {/* barre de progression */}
        <div className="h-3 bg-white rounded-full overflow-hidden mb-6 shadow-inner border border-amber-200">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${((idx + (solved ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{mission.icon}</span>
            <span className="font-bold text-blue-900">{mission.title}</span>
          </div>

          <p className="text-lg text-slate-800 mb-2 leading-relaxed">{q.prompt}</p>

          {q.numberLine && <NumberLine data={q.numberLine} />}

          {q.type === "mcq" ? (
            <div className="grid gap-2 mt-4">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => check(opt)}
                  disabled={solved}
                  className={
                    "text-left px-4 py-3 rounded-xl border-2 font-medium transition-colors " +
                    (solved && norm(opt) === norm(q.answer)
                      ? "bg-green-100 border-green-500 text-green-900"
                      : "bg-amber-50 border-amber-200 hover:border-amber-400 hover:bg-amber-100 text-slate-800 disabled:opacity-60")
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !solved && input.trim() && check(input)}
                disabled={solved}
                placeholder="Ta réponse..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-lg bg-amber-50 disabled:opacity-60"
                autoFocus
              />
              {!solved && (
                <button
                  onClick={() => input.trim() && check(input)}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-5 rounded-xl transition-colors"
                >
                  Valider
                </button>
              )}
            </div>
          )}

          {feedback && (
            <div className={"mt-4 p-4 rounded-xl font-semibold " + (feedback.ok ? "bg-green-100 text-green-800 border-2 border-green-300" : "bg-orange-100 text-orange-800 border-2 border-orange-300")}>
              {feedback.msg}
            </div>
          )}

          {showHint && !solved && (
            <div className="mt-3 p-4 rounded-xl bg-sky-50 border-2 border-sky-200 text-sky-900">
              <span className="font-bold">💡 Indice : </span>{q.hint}
            </div>
          )}

          {solved && (
            <button onClick={next} className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow transition-colors">
              {idx + 1 >= questions.length ? "Voir mon résultat 🏆" : "Question suivante →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
