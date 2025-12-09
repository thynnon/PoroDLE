// citations-data.js - Base de données des citations par champion

const CHAMPION_QUOTES = {
  'Aatrox': [
    "Je ne suis pas ton ennemi. Je suis L'ennemi.",
    "Combats ou meurs !",
    "La guerre est éternelle.",
    "Je suis la fin de toute chose.",
    "Venez ! Laissez-moi mettre fin à vos souffrances !"
  ],
  'Ahri': [
    "Charmant.",
    "Ne me tente pas.",
    "Qui sera ma prochaine proie ?",
    "Tout le monde mérite une seconde chance.",
    "Veux-tu jouer aussi ?"
  ],
  'Akali': [
    "Un assassin n'a pas de conscience, seulement une cible.",
    "L'équilibre est faiblesse.",
    "J'ai quitté les Kinkou... mais pas mes principes.",
    "Ils vont regretter de m'avoir défié.",
    "Les ombres sont mes alliées."
  ],
  'Alistar': [
    "Rien ne peut m'arrêter !",
    "Vous ne pouvez pas me faire tomber !",
    "Courage !",
    "Brisez leurs rangs !",
    "La liberté pour tous !"
  ],
  'Amumu': [
    "Allons jouer !",
    "Je pensais que tu ne me demanderais jamais...",
    "Viens jouer avec moi...",
    "Laisse-moi t'étreindre !",
    "Je croyais que tu ne reviendrais jamais..."
  ],
  'Anivia': [
    "Par la glace !",
    "Que le froid les saisisse.",
    "Sur l'aile de la tempête.",
    "Je suis le gardien de ces terres.",
    "Le cycle continue."
  ],
  'Annie': [
    "Tu veux jouer aussi ? Ce sera très amusant !",
    "Tibbers ! Grrrr !",
    "Brûle avec moi !",
    "Battons-nous avec le feu !",
    "Viens Tibbers !"
  ],
  'Ashe': [
    "Ma visée est sûre.",
    "Avancez !",
    "Nous ne reculerons pas.",
    "Unis dans le combat !",
    "Pour Freljord !"
  ],
  'Bard': [
    "~Ootay~",
    "*Chimes musicaux*",
    "~Bwoooong~",
    "*Sons cosmiques*",
    "~Ding~"
  ],
  'Blitzcrank': [
    "Bip boup.",
    "Unité de vapeur prête.",
    "Golem de vapeur opérationnel.",
    "Fonction : Éliminer.",
    "Je détecte de bonnes vibrations."
  ],
  'Brand': [
    "Brûlez !",
    "Le monde entier brûlera !",
    "Ce monde ne mérite que le feu !",
    "Est-ce que ça brûle ?",
    "Les flammes monteront !"
  ],
  'Braum': [
    "La porte, c'est par là !",
    "Le muscle le plus fort, c'est le cœur !",
    "Ne t'inquiète pas, ami ! Braum est là !",
    "Parfois, le cœur est aussi tranchant que la lame.",
    "La moustache n'est pas seulement pour être beau !"
  ],
  'Caitlyn': [
    "Paix à Piltover.",
    "Je vais droit au but.",
    "Je ne rate jamais deux fois.",
    "Tête à tête.",
    "Attendez la fin de votre mandat."
  ],
  'Darius': [
    "Seuls les forts survivent.",
    "Noxus jugera.",
    "Courage et honneur !",
    "Votre mort servira Noxus.",
    "Ils verront la puissance de Noxus !"
  ],
  'Diana': [
    "Un guerrier sait quand se battre.",
    "Embrassez la nuit.",
    "La lune se lèvera.",
    "J'amène la nuit.",
    "Dissiper les ténèbres."
  ],
  'Draven': [
    "Draven fait... Draven.",
    "Bienvenue à la ligue de Draven !",
    "Pas Draven... Draaaaaven !",
    "Tout le monde aime Draven.",
    "Draven tue, Draven gagne."
  ],
  'Ekko': [
    "C'est pas aujourd'hui que je vais crever.",
    "Je vais leur montrer ce que Zaun peut faire.",
    "J'aime bien ta coiffure... je l'aimais bien.",
    "C'est pas le temps qui manque, c'est ce que tu en fais.",
    "Le temps, c'est plus que de l'argent."
  ],
  'Ezreal': [
    "Vous appartenez à un musée !",
    "Le temps, c'est de l'argent, mon ami.",
    "Noxus... je déteste ce coin pourri.",
    "Ça, c'était trop facile.",
    "Qui a besoin d'une carte ?"
  ],
  'Garen': [
    "Pour Demacia !",
    "Justice !",
    "L'épée du roi ne craint rien.",
    "Ma résolution ne faiblit jamais.",
    "Demacia ne tombera jamais !"
  ],
  'Jhin': [
    "L'art nécessite un certain... engagement cruel.",
    "Dans la mort, nous fleurissons.",
    "Derrière chaque masque... se cache un autre masque.",
    "Quatre !",
    "La beauté est la douleur."
  ],
  'Jinx': [
    "Prends-en plein la gueule !",
    "Règles ? On s'en fout !",
    "Je suis folle ? J'ai eu un certificat médical qui dit le contraire !",
    "Fishbones, t'es mon meilleur ami !",
    "Et maintenant... on s'amuse !"
  ],
  'Katarina': [
    "La violence résout tout.",
    "Jamais d'hésitation.",
    "Sans pitié. Sans remords.",
    "Je déteste les incertitudes.",
    "Mort à tous !"
  ],
  'Kayn': [
    "Je suis la leçon qui doit être apprise !",
    "Obéis !",
    "L'ombre triomphe !",
    "Je refuse de servir.",
    "Seul le plus fort survivra."
  ],
  'LeeSin': [
    "Tes yeux te trahissent.",
    "Maîtrise toi, maîtrise l'ennemi.",
    "Ne faites qu'un avec votre arme.",
    "L'action forge les légendes.",
    "Le dragon révèle sa forme !"
  ],
  'Lux': [
    "Double arc-en-ciel ? Qu'est-ce que ça veut dire ?",
    "Si tu ne peux pas les aider, au moins éclaire-les !",
    "Restons positifs !",
    "La lumière nous protégera !",
    "Illumination !"
  ],
  'Lulu': [
    "Ce goût de mauve... de mauve !",
    "Oui, c'est une bonne recette !",
    "Coucou !",
    "Pix veut jouer aussi !",
    "Gros trucs pour toi !"
  ],
  'MissFortune': [
    "La fortune ne sourit pas aux imbéciles.",
    "Ne jamais perdre.",
    "Armes chargées.",
    "Visez bien.",
    "Je vais leur apprendre à respecter."
  ],
  'Pyke': [
    "Liste à faire : te tuer.",
    "Tu es sur ma liste.",
    "Ils vont tous payer.",
    "Je les ai tous entendu crier mon nom.",
    "Bilgewater va payer."
  ],
  'Riven': [
    "Une épée miroir de son propriétaire.",
    "Ce qui est brisé peut être reforgé.",
    "Je ne cherche pas la rédemption.",
    "Tant de vies gâchées...",
    "Un guerrier connaît son chemin."
  ],
  'Sona': [
    "...",
    "♪",
    "~",
    "♫",
    "*Sons de harpe*"
  ],
  'Teemo': [
    "Jamais sous-estimer le pouvoir du code des éclaireurs !",
    "Hut deux trois quatre !",
    "Capitaine Teemo, en service !",
    "Armé et dangereux !",
    "La taille n'a pas d'importance !"
  ],
  'Thresh': [
    "Quelle âme délicieuse.",
    "Je ne suis pas cruel. Je suis juste indifférent à la souffrance.",
    "Bienvenue dans mon royaume.",
    "Ta prison t'attend.",
    "Viens... plus près..."
  ],
  'Vayne': [
    "Pas de pitié pour les démons.",
    "La nuit est mon voile.",
    "Les ténèbres recèlent des monstres terrifiants.",
    "Je suis mon propre juge.",
    "La nuit tombe."
  ],
  'Vi': [
    "Poing dans ta face !",
    "Je frappe d'abord, je pose des questions en frappant.",
    "Tu résistes ? J'insiste !",
    "Plan ? Je n'ai pas besoin de plan.",
    "Boum ! En pleine tête !"
  ],
  'Yasuo': [
    "La mort est comme le vent, toujours à mes côtés.",
    "Un épéiste solitaire.",
    "Hasagi !",
    "Mon honneur est perdu, mais mes lames sont tranchantes.",
    "Suivez la lame."
  ],
  'Zed': [
    "L'ombre est éternelle.",
    "Embrasse les ténèbres.",
    "Aucune technique n'est interdite.",
    "Les ombres ont engloutis ceux qui les ont ignorés.",
    "La vérité réside dans les ténèbres."
  ],
  'Zyra': [
    "Sentez les épines.",
    "Notre saison est arrivée.",
    "La nature ne pardonne pas.",
    "Je ferai fleurir cette terre.",
    "Laissez la nature reprendre ses droits."
  ],
  'Syndra': [
    "Ils m'ont appelée faible... Qu'en pensent-ils maintenant ?",
    "Mon pouvoir est sans limite.",
    "Tant de pouvoir.",
    "Brisez leurs défenses !",
    "Il n'y a pas de limite à ma puissance."
  ],
  'Viego': [
    "Isolde...",
    "Tout pour Isolde.",
    "Elle reviendra.",
    "Mon cœur bat... pour elle.",
    "L'amour transcende la mort."
  ],
  'Seraphine': [
    "Tout le monde mérite d'être entendu !",
    "Chantons ensemble !",
    "La musique nous unit !",
    "Votre chanson est magnifique !",
    "Harmony, harmonie !"
  ],
  'Aphelios': [
    "...",
    "*silence*",
    "*silence déterminé*",
    "*respiration concentrée*",
    "*pas de mots*"
  ],
  'Vex': [
    "Ouais... super.",
    "Je déteste tout le monde.",
    "Pourquoi être heureux quand tu peux être triste ?",
    "L'ombre m'appelle.",
    "Bof."
  ],
  'Samira': [
    "La vie, c'est trop court pour s'ennuyer.",
    "Style !",
    "Trop facile.",
    "C'est tout ce que vous avez ?",
    "Maintenant, c'est une fête !"
  ],
  'Swain': [
    "La vision sans action n'est qu'un rêve.",
    "Noxus ne tolérera aucune faiblesse.",
    "Le pouvoir, c'est tout.",
    "Je vois tout.",
    "Les secrets n'existent pas pour moi."
  ],
  'Taliyah': [
    "Jetons la première pierre.",
    "Les rochers sont mes amis.",
    "Je vais créer ma propre destinée.",
    "Un voyage de mille lieues...",
    "La pierre répond à ma volonté."
  ]
};

// Fonction pour récupérer une citation aléatoire d'un champion
function getRandomQuote(championId) {
  const quotes = CHAMPION_QUOTES[championId];
  if (!quotes || quotes.length === 0) {
    return "...";
  }
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Fonction pour vérifier si un champion a des citations
function hasQuotes(championId) {
  return CHAMPION_QUOTES[championId] && CHAMPION_QUOTES[championId].length > 0;
}

// Fonction pour obtenir tous les champions avec citations
function getChampionsWithQuotes() {
  return Object.keys(CHAMPION_QUOTES);
}