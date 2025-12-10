// ----------------------------------------------------------
// CHARGEMENT DES ITEMS VIA DATA DRAGON (OFFICIEL)
// ----------------------------------------------------------

// Fonction utilitaire : transforme item.json → tableau propre
async function fetchAllItems(version) {
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`
  );
  const data = await res.json();

  return Object.entries(data.data)
    .map(([id, it]) => ({
      id,
      name: it.name,
      icon: it.image.full,
      price: it.gold?.total ?? 0        // 👈 très utile pour PriceGame !
    }))
    .filter(it =>
      !it.name.includes("Suppression") &&
      !it.name.includes("Removed")
    );
}

// ---------- Modal Règles ----------
function ItemsRulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return React.createElement('div', {
    style: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.6)',
      zIndex: 9999
    }
  },
    React.createElement('div', {
      className: 'glass',
      style: { padding: '1.5rem', width: 'min(720px, 95%)', borderRadius: '12px' }
    },
      React.createElement('h2', { style: { marginTop: 0 } }, '📖 Règles du Mode Items'),
      React.createElement('p', null, 'Trois mini-jeux différents pour tester tes connaissances sur les objets de League of Legends :'),
      React.createElement('ul', null,
        React.createElement('li', null, '🔍 Item Zoomé — devine l\'item en voyant un zoom progressif'),
        React.createElement('li', null, '💰 Prix Battle — choisis l\'item le plus cher sur 10 rounds'),
        React.createElement('li', null, '🛡️ Build Mystery — devine le champion à partir d\'une build de 4-6 items')
      ),
      React.createElement('div', { style: { textAlign: 'center', marginTop: '1rem' } },
        React.createElement('button', { className: 'btn btn-primary', onClick: onClose }, 'Fermer')
      )
    )
  );
}

// ---------- Selecteur mini-jeux ----------
function GameSelector({ selectedGame, onSelectGame }) {
  const games = [
    { id: 'zoom', name: 'Item Zoomé', emoji: '🔍', color: '#10b981' },
    { id: 'price', name: 'Prix Battle', emoji: '💰', color: '#f59e0b' },
    { id: 'build', name: 'Build Mystery', emoji: '🛡️', color: '#8b5cf6' }
  ];

  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '1.5rem'
    }
  },
    games.map(g =>
      React.createElement('button', {
        key: g.id,
        onClick: () => onSelectGame(g.id),
        className: 'btn',
        style: {
          padding: '0.8rem 1rem',
          borderRadius: '10px',
          border: selectedGame === g.id ? `2px solid ${g.color}` : '2px solid rgba(255,255,255,0.06)',
          background: selectedGame === g.id ? `${g.color}15` : 'transparent',
          color: '#f0e6d2',
          cursor: 'pointer'
        }
      }, `${g.emoji} ${g.name}`)
    )
  );
}

// ========================================
// MINI-JEU 1 : ITEM ZOOMÉ
// ========================================
function ZoomGame({ version, onComplete }) {
  const [targetItem, setTargetItem] = React.useState(null);
  const [guesses, setGuesses] = React.useState([]);
  const [won, setWon] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);

  const ZOOM_LEVELS = [800, 700, 600, 500, 400, 350, 300, 250, 200, 150, 125, 100];

  React.useEffect(() => {
    const random = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    setTargetItem(random);
    setGuesses([]);
    setWon(false);
    setSearchInput('');
    setShowDropdown(false);
  }, []);

  const getZoomLevel = () => ZOOM_LEVELS[Math.min(guesses.length, ZOOM_LEVELS.length - 1)];

  const handleGuess = (item) => {
    if (won || !targetItem) return;
    if (guesses.some(g => g.id === item.id)) return;
    const isCorrect = String(item.id) === String(targetItem.id);
    setGuesses(prev => [...prev, { ...item, isCorrect }]);
    setSearchInput('');
    setShowDropdown(false);
    if (isCorrect) {
      setWon(true);
      setTimeout(() => onComplete && onComplete({ attempts: guesses.length + 1 }), 800);
    }
  };

  if (!targetItem) return null;
  const currentZoom = getZoomLevel();

  return React.createElement('div', {
    style: { position: 'relative', zIndex: 20, pointerEvents: 'auto' }
  },
    React.createElement('h3', { style: { textAlign: 'center', color: '#10b981' } }, '🔍 Devine l\'Item Zoomé'),
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }
    },
      React.createElement('div', {
        style: {
          width: '400px',
          height: '400px',
          maxWidth: '90vw',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '4px solid rgba(16,185,129,0.45)',
          background: '#000'
        }
      },
        React.createElement('div', {
          style: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }
        },
          React.createElement('img', {
            src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${targetItem.icon}`,
            alt: 'item zoom',
            style: {
              width: `${currentZoom}%`,
              height: `${currentZoom}%`,
              objectFit: 'cover',
              transition: 'all 0.8s ease',
              imageRendering: 'pixelated'
            }
          })
        )
      ),

      React.createElement('div', { style: { color: '#c8aa6e', fontWeight: 600 } }, `Tentatives : ${guesses.length}`)
    ),

    // recherche + dropdown
    React.createElement('div', { style: { width: '100%', maxWidth: '520px', margin: '0 auto', position: 'relative' } },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Cherche un item...',
        value: searchInput,
        onChange: e => setSearchInput(e.target.value),
        onFocus: () => setShowDropdown(true),
        onBlur: () => setTimeout(() => setShowDropdown(false), 200),
        style: {
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,12,0.6)',
          color: '#fff'
        }
      }),
      showDropdown && React.createElement('div', {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 'calc(100% + 8px)',
          background: '#111',
          border: '1px solid rgba(200,170,110,0.15)',
          borderRadius: '8px',
          maxHeight: '260px',
          overflowY: 'auto',
          zIndex: 30
        }
      },
        ALL_ITEMS
          .filter(it => it.name.toLowerCase().includes(searchInput.toLowerCase()))
          .slice(0, 12)
          .map(item =>
            React.createElement('div', {
              key: item.id,
              onClick: () => handleGuess(item),
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(200,170,110,0.06)'
              },
              onMouseEnter: e => e.currentTarget.style.background = 'rgba(200,170,110,0.06)',
              onMouseLeave: e => e.currentTarget.style.background = 'transparent'
            },
              React.createElement('img', {
                src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.icon}`,
                alt: item.name,
                style: { width: '40px', height: '40px', borderRadius: '6px' }
              }),
              React.createElement('span', { style: { color: '#f0e6d2' } }, item.name)
            )
          )
      )
    ),

    won && React.createElement('div', {
      className: 'glass',
      style: { marginTop: '1rem', padding: '1rem', borderRadius: '10px', border: '2px solid rgba(16,185,129,0.5)' }
    },
      React.createElement('div', { style: { fontSize: '2rem' } }, '✅ Trouvé !'),
      React.createElement('p', null, `C'était ${targetItem.name} en ${guesses.length} tentative(s).`)
    )
  );
}

// ========================================
// MINI-JEU 2 : PRIX BATTLE
// ========================================
function PriceGame({ version, onComplete }) {
  const [items, setItems] = React.useState([]);
  const [currentRound, setCurrentRound] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [lastChoice, setLastChoice] = React.useState(null);

  const MAX_ROUNDS = 10;
  // prix fictifs
  const ITEM_PRICES = {
    6630: 3200, 6631: 3300, 6632: 2800, 6653: 2800, 6655: 3200, 6656: 3000,
    6662: 2500, 6664: 2900, 3068: 2500, 4633: 2600, 4636: 2800, 3190: 2200,
    3031: 3400, 3124: 2600, 3153: 3200, 3026: 2800, 3094: 2800, 3085: 2600,
    3036: 3000, 3110: 2500, 3087: 2600, 3078: 3333, 3135: 2600, 3089: 3600,
    3165: 2200, 3157: 2600, 3102: 2200, 3006: 1100, 3020: 1100, 3047: 1100,
    3009: 1000, 3111: 1100, 3158: 900
  };

  React.useEffect(() => {
    // génère la première paire
    const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5);
    setItems([shuffled[0], shuffled[1]]);
    setShowResult(false);
    setLastChoice(null);
  }, []);

  const handleChoice = (chosenItem) => {
    if (showResult) return;
    const otherItem = items.find(i => i.id !== chosenItem.id);
    const chosenPrice = ITEM_PRICES[chosenItem.id] || 0;
    const otherPrice = ITEM_PRICES[otherItem.id] || 0;
    const isCorrect = chosenPrice >= otherPrice;

    setLastChoice({ correct: isCorrect, chosenItem, otherItem, chosenPrice, otherPrice });
    setShowResult(true);
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentRound < MAX_ROUNDS) {
        setCurrentRound(prev => prev + 1);
        const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5);
        setItems([shuffled[0], shuffled[1]]);
        setShowResult(false);
        setLastChoice(null);
      } else {
        onComplete && onComplete({ score: score + (isCorrect ? 1 : 0), maxRounds: MAX_ROUNDS });
      }
    }, 1200);
  };

  return React.createElement('div', {
    style: { position: 'relative', zIndex: 20, pointerEvents: 'auto' }
  },
    React.createElement('h3', { style: { textAlign: 'center', color: '#f59e0b' } }, '💰 Quel Item Coûte Plus Cher ?'),
    React.createElement('p', { style: { textAlign: 'center', color: '#c8aa6e' } }, `Round ${currentRound}/${MAX_ROUNDS} — Score ${score}`),

    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }
    },
      items.map(item =>
        React.createElement('div', {
          key: item.id,
          onClick: () => handleChoice(item),
          style: {
            cursor: showResult ? 'default' : 'pointer',
            padding: '1rem',
            textAlign: 'center',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: showResult && lastChoice
              ? (lastChoice.chosenItem.id === item.id
                ? (lastChoice.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)')
                : 'transparent')
              : 'transparent'
          }
        },
          React.createElement('img', {
            src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.icon}`,
            alt: item.name,
            style: { width: '120px', height: '120px', borderRadius: '8px' }
          }),
          React.createElement('h4', { style: { color: '#f0e6d2' } }, item.name),
          showResult && React.createElement('div', { style: { marginTop: '0.5rem', fontWeight: 700 } }, `${ITEM_PRICES[item.id] || 0} 💰`)
        )
      )
    )
  );
}

// ========================================
// MINI-JEU 3 : BUILD MYSTERY
// ========================================
function BuildGame({ version, champions, onComplete }) {
  const CHAMPION_BUILDS = {
    'Jinx': [3031, 3094, 3085, 3006, 3036, 3026],
    'Yasuo': [6655, 3031, 3087, 3078, 3006, 3026],
    'Zed': [6632, 3142, 3814, 3036, 3111, 3026],
    'Lux': [3089, 3165, 3157, 3020, 3135, 3102],
    'Garen': [6631, 3071, 3742, 3047, 3036, 3026],
    'Darius': [6630, 3071, 3742, 3047, 3053, 3026],
    'LeeSin': [6630, 3071, 3053, 3047, 3742, 3026],
    'Ahri': [3089, 3157, 3135, 3020, 3165, 3102],
    'Thresh': [3190, 3107, 3020, 3222, 3109, 3190],
    'Vayne': [6655, 3085, 3031, 3006, 3036, 3026]
  };

  const [targetChampion, setTargetChampion] = React.useState(null);
  const [buildItems, setBuildItems] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [won, setWon] = React.useState(false);
  const [guesses, setGuesses] = React.useState([]);

  React.useEffect(() => {
    const names = Object.keys(CHAMPION_BUILDS);
    const randomName = names[Math.floor(Math.random() * names.length)];
    const champFromList = champions && champions.find(c => String(c.nom).toLowerCase() === String(randomName).toLowerCase());
    // fallback si champ non trouvé dans `champions`
    const target = champFromList || { id: randomName, nom: randomName };
    setTargetChampion(target);

    const ids = CHAMPION_BUILDS[randomName];
    const itemsFound = ids.map(id => ALL_ITEMS.find(it => String(it.id) === String(id))).filter(Boolean);
    setBuildItems(itemsFound);
    setWon(false);
    setGuesses([]);
    setSearchInput('');
    setShowDropdown(false);
  }, [champions]);

  const handleGuess = (champ) => {
    if (won) return;
    setGuesses(prev => [...prev, champ]);
    if (String(champ.id).toLowerCase() === String(targetChampion.id).toLowerCase() || String(champ.nom).toLowerCase() === String(targetChampion.nom).toLowerCase()) {
      setWon(true);
      setTimeout(() => onComplete && onComplete({ attempts: guesses.length + 1 }), 800);
    }
    setSearchInput('');
    setShowDropdown(false);
  };

  return React.createElement('div', { style: { position: 'relative', zIndex: 20 } },
    React.createElement('h3', { style: { textAlign: 'center', color: '#8b5cf6' } }, '🛡️ Devine le Champion de cette Build'),

    React.createElement('div', {
      className: 'glass',
      style: { padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }
    },
      React.createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', maxWidth: '700px', margin: '0 auto' }
      },
        buildItems.map((it, idx) =>
          React.createElement('div', { key: idx, style: { textAlign: 'center' } },
            React.createElement('img', {
              src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${it.icon}`,
              alt: it.name,
              style: { width: '100%', height: 'auto', borderRadius: '8px', border: '2px solid rgba(139,92,246,0.25)' }
            }),
            React.createElement('div', { style: { fontSize: '0.75rem', color: '#f0e6d2', marginTop: '0.35rem' } }, it.name)
          )
        )
      )
    ),

    // Input pour deviner le champion
    React.createElement('div', { style: { maxWidth: '520px', margin: '0 auto', position: 'relative' } },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Devine le champion...',
        value: searchInput,
        onChange: e => setSearchInput(e.target.value),
        onFocus: () => setShowDropdown(true),
        onBlur: () => setTimeout(() => setShowDropdown(false), 200),
        style: { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,12,0.6)', color: '#fff' }
      }),
      showDropdown && React.createElement('div', {
        style: { position: 'absolute', left: 0, right: 0, top: 'calc(100% + 8px)', background: '#111', borderRadius: '8px', maxHeight: '260px', overflowY: 'auto', zIndex: 30 }
      },
        (champions || [])
          .filter(c => c.nom.toLowerCase().includes(searchInput.toLowerCase()))
          .slice(0, 25)
          .map(c =>
            React.createElement('div', {
              key: c.id,
              onClick: () => handleGuess(c),
              style: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem', cursor: 'pointer', borderBottom: '1px solid rgba(200,170,110,0.06)' },
              onMouseEnter: e => e.currentTarget.style.background = 'rgba(200,170,110,0.04)',
              onMouseLeave: e => e.currentTarget.style.background = 'transparent'
            },
              React.createElement('img', { src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${c.id}.png`, alt: c.nom, style: { width: '36px', height: '36px', borderRadius: '6px' } }),
              React.createElement('span', { style: { color: '#f0e6d2' } }, c.nom)
            )
          )
      )
    ),

    won && React.createElement('div', { className: 'glass', style: { marginTop: '1rem', padding: '1rem', borderRadius: '10px', border: '2px solid rgba(139,92,246,0.5)' } },
      React.createElement('h4', null, '🎉 Champion trouvé !'),
      React.createElement('p', null, `C'était ${targetChampion.nom} !`)
    )
  );
}

// ========================================
// COMPOSANT PRINCIPAL : ITEMS MODE
// ========================================
function ItemsMode({ version, resetFlag }) {
  const [items, setItems] = React.useState([]);
  const [targetItem, setTargetItem] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [guesses, setGuesses] = React.useState([]);
  const [won, setWon] = React.useState(false);

  // === LOAD ITEMS FROM DATA DRAGON ===
  React.useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`)
      .then(res => res.json())
      .then(data => {
        const parsed = Object.entries(data.data).map(([id, it]) => ({
          id,
          name: it.name,
          icon: it.image.full
        }));

        setItems(parsed);

        const random = parsed[Math.floor(Math.random() * parsed.length)];
        setTargetItem(random);

        setWon(false);
        setGuesses([]);
        setInput("");
      });
  }, [resetFlag, version]);

  // === FILTERED LIST ===
  const filtered = items.filter(it =>
    it.name.toLowerCase().includes(input.toLowerCase())
  );

  // === CLICK HANDLER ===
  const handleGuess = (item) => {
    if (won) return;

    const newGuesses = [...guesses, item];
    setGuesses(newGuesses);

    if (item.id === targetItem.id) {
      setWon(true);
    }
  };

  return React.createElement(
    "div",
    { className: "container", style: { maxWidth: "650px" } },

    // ================= INPUT SEARCH =================
    React.createElement("input", {
      type: "text",
      placeholder: "Cherche un item…",
      value: input,
      onChange: (e) => setInput(e.target.value),
      style: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        fontSize: "1rem",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(0,0,0,0.4)",
        color: "#fff",
      },
    }),

    // ================= LISTE SCROLLABLE =================
    React.createElement(
      "div",
      {
        style: {
          maxHeight: "300px",
          overflowY: "auto",
          background: "rgba(15,15,20,0.8)",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "1.5rem",
        },
      },
      filtered.map((item) =>
        React.createElement(
          "div",
          {
            key: item.id,
            onClick: () => handleGuess(item),
            style: {
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem",
              cursor: "pointer",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              transition: "background 0.15s",
            },
            onMouseEnter: (e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)"),
            onMouseLeave: (e) =>
              (e.currentTarget.style.background = "transparent"),
          },
          React.createElement("img", {
            src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.icon}`,
            alt: item.name,
            style: { width: "40px", height: "40px", borderRadius: "6px" },
          }),
          React.createElement(
            "span",
            { style: { color: "#f0e6d2", fontWeight: 500 } },
            item.name
          )
        )
      )
    ),

    // ================= WIN SCREEN =================
    won &&
      React.createElement(
        "div",
        {
          className: "glass",
          style: {
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            border: "2px solid rgba(16,185,129,0.6)",
            background: "rgba(16,185,129,0.05)",
          },
        },
        React.createElement(
          "div",
          { style: { fontSize: "3rem", marginBottom: "1rem" } },
          "🎉"
        ),
        React.createElement(
          "h3",
          {
            style: {
              fontSize: "2rem",
              marginBottom: "0.5rem",
              color: "#10b981",
            },
          },
          "Bravo !"
        ),
        React.createElement(
          "p",
          { style: { fontSize: "1.25rem", color: "#f0e6d2" } },
          `C’était ${targetItem.name} en ${guesses.length} tentative(s) !`
        )
      )
  );
}

