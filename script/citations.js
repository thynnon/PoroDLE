// citations.js - Mode Citations

// Données des citations chargées depuis le JSON
let VOICELINES_DATA = null;

// Charger les données des citations
async function loadVoicelinesData() {
  if (VOICELINES_DATA) return VOICELINES_DATA;
  
  try {
    const response = await fetch('script/lol_voicelines_FR.json');
    VOICELINES_DATA = await response.json();
    return VOICELINES_DATA;
  } catch (error) {
    console.error('Erreur lors du chargement des citations:', error);
    return {};
  }
}

// Vérifier si un champion a des citations
function hasQuotes(championId) {
  if (!VOICELINES_DATA) return false;
  const champData = VOICELINES_DATA[championId];
  return champData && champData.voicelines && champData.voicelines.length > 0;
}

// Obtenir une citation aléatoire pour un champion
function getRandomQuote(championId) {
  if (!VOICELINES_DATA || !hasQuotes(championId)) {
    return "Citation non disponible";
  }
  
  const champData = VOICELINES_DATA[championId];
  const quotes = champData.voicelines;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Modal des règles pour le mode Citations
function CitationsRulesModal({ isOpen, onClose }) {
  return React.createElement(Modal, { isOpen, onClose, title: '📖 Règles du Mode Citations' },
    React.createElement('p', null, 
      'Devine le champion en lisant l\'une de ses citations iconiques ! Seuls les champions ayant des voix françaises sont inclus dans ce mode.'
    ),
    
    React.createElement('h3', null, '🎯 Comment jouer ?'),
    React.createElement('ul', null,
      React.createElement('li', null, '💬 Une citation aléatoire est affichée'),
      React.createElement('li', null, '🔍 Lis attentivement la citation pour identifier le style du champion'),
      React.createElement('li', null, '🎭 Certains champions ont des citations très reconnaissables !'),
      React.createElement('li', null, '✅ Trouve le champion en un minimum de tentatives')
    ),
    
    React.createElement('h3', null, '💡 Conseils'),
    React.createElement('ul', null,
      React.createElement('li', null, '🗣️ Fais attention au ton : agressif, enjoué, mystérieux...'),
      React.createElement('li', null, '🎪 Certains champions ont des répliques cultes !'),
      React.createElement('li', null, '🎨 Le vocabulaire peut donner des indices sur la région'),
      React.createElement('li', null, '⚔️ Les citations reflètent souvent la personnalité du champion')
    ),
    
    React.createElement('h3', null, '🎮 Options de difficulté'),
    React.createElement('ul', null,
      React.createElement('li', null,
        React.createElement('span', { style: { display: 'inline-block', marginRight: '8px' } }, '👁️'),
        'Mode Normal : La citation complète est affichée'
      ),
      React.createElement('li', null,
        React.createElement('span', { style: { display: 'inline-block', marginRight: '8px' } }, '❓'),
        'Mode Difficile : Des mots sont masqués dans la citation'
      )
    ),
    
    React.createElement('h3', null, '🌟 Exemples de citations célèbres'),
    React.createElement('ul', null,
      React.createElement('li', null, '💥 "Poing dans ta face !" - Un champion direct et brutal'),
      React.createElement('li', null, '🎭 "L\'art nécessite un certain... engagement cruel." - Un perfectionniste'),
      React.createElement('li', null, '⚡ "Hasagi !" - Un épéiste iconique'),
      React.createElement('li', null, '🎪 "Draven fait... Draven." - Un champion narcissique')
    ),
    
    React.createElement('p', { 
      style: { 
        marginTop: '1.5rem', 
        fontWeight: 600,
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#c8aa6e'
      } 
    },
      '💬 Les mots révèlent l\'âme du champion ! 🎭'
    )
  );
}

function CitationsMode({ champions, version, resetFlag, setShowSettings, onNextMode, currentMode }) {
  const [target, setTarget] = React.useState(null);
  const [quote, setQuote] = React.useState('');
  const [guesses, setGuesses] = React.useState([]);
  const [won, setWon] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);
  const [hardMode, setHardMode] = React.useState(false);
  const [maskedQuote, setMaskedQuote] = React.useState('');
  const [revealedWords, setRevealedWords] = React.useState(new Set());
  const [dataLoaded, setDataLoaded] = React.useState(false);

  // Charger les données au montage
  React.useEffect(() => {
    loadVoicelinesData().then(() => {
      setDataLoaded(true);
    });
  }, []);

  // Fonction pour masquer des mots aléatoires dans la citation
  const maskQuote = React.useCallback((text) => {
    const words = text.split(' ');
    const numWordsToMask = Math.max(1, Math.floor(words.length * 0.4)); // Masquer 40% des mots
    const indicesToMask = new Set();
    
    while (indicesToMask.size < numWordsToMask && indicesToMask.size < words.length - 1) {
      const randomIndex = Math.floor(Math.random() * words.length);
      // Ne pas masquer le premier mot pour garder un indice
      if (randomIndex !== 0) {
        indicesToMask.add(randomIndex);
      }
    }
    
    return words.map((word, index) => {
      if (indicesToMask.has(index)) {
        return '_____';
      }
      return word;
    }).join(' ');
  }, []);

  // Reset le jeu
  const reset = React.useCallback(() => {
    if (!champions || champions.length === 0 || !dataLoaded) return;
    
    // Filtrer les champions qui ont des citations
    const championsWithQuotes = champions.filter(c => hasQuotes(c.id));
    
    if (championsWithQuotes.length === 0) {
      console.error('Aucun champion avec citations trouvé');
      return;
    }
    
    const random = championsWithQuotes[Math.floor(Math.random() * championsWithQuotes.length)];
    const randomQuote = getRandomQuote(random.id);
    
    setTarget(random);
    setQuote(randomQuote);
    setMaskedQuote(maskQuote(randomQuote));
    setGuesses([]);
    setWon(false);
    setSearchInput('');
    setShowDropdown(false);
    setRevealedWords(new Set());
  }, [champions, maskQuote, dataLoaded]);

  React.useEffect(() => { 
    if (dataLoaded) {
      reset();
    }
  }, [reset, resetFlag, dataLoaded]);

  const handleGuess = (champ) => {
    if (won || !target) return;
    if (guesses.some(g => g.id === champ.id)) return;
    
    const isCorrect = champ.id === target.id;
    setGuesses(prev => [...prev, { ...champ, isCorrect }]);
    setSearchInput('');
    setShowDropdown(false);
    
    if (isCorrect) {
      setWon(true);
    }
  };

  // Fonction pour révéler un mot dans le mode difficile
  const revealWord = () => {
    const words = quote.split(' ');
    const maskedWords = maskedQuote.split(' ');
    const hiddenIndices = maskedWords
      .map((word, index) => word === '_____' ? index : -1)
      .filter(index => index !== -1 && !revealedWords.has(index));
    
    if (hiddenIndices.length > 0) {
      const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      setRevealedWords(prev => new Set([...prev, randomIndex]));
    }
  };

  // Afficher la citation avec les mots révélés
  const getDisplayQuote = () => {
    if (!hardMode) return quote;
    
    const words = quote.split(' ');
    const maskedWords = maskedQuote.split(' ');
    
    return maskedWords.map((word, index) => {
      if (word === '_____' && !revealedWords.has(index)) {
        return '_____';
      }
      return words[index];
    }).join(' ');
  };

  if (!dataLoaded || !target) {
    return React.createElement('div', { 
      style: { 
        textAlign: 'center', 
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      } 
    }, 
      React.createElement('div', { style: { fontSize: '3rem' } }, '💬'),
      React.createElement('div', { style: { fontSize: '1.5rem', color: '#c8aa6e' } }, 'Chargement des citations...')
    );
  }

  // Boutons de contrôle
  const controlButtons = React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    }
  },
    React.createElement('button', {
      className: 'btn btn-secondary',
      onClick: () => setShowRules(true)
    }, '📖 RÈGLES'),
    
    React.createElement('div', {
      style: {
        width: '2px',
        height: '30px',
        background: 'rgba(240, 230, 210, 0.2)',
        margin: '0 0.5rem'
      }
    }),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        background: 'rgba(240, 230, 210, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(240, 230, 210, 0.1)'
      }
    },
      React.createElement('span', {
        style: {
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#f0e6d2'
        }
      }, '❓ Mode Difficile'),
      React.createElement('div', {
        className: `settings-toggle ${hardMode ? 'active' : ''}`,
        onClick: () => {
          setHardMode(!hardMode);
          setRevealedWords(new Set());
        },
        style: { cursor: 'pointer' }
      },
        React.createElement('div', { className: 'settings-toggle-thumb' })
      )
    ),
    
    hardMode && React.createElement('button', {
      className: 'btn btn-secondary',
      onClick: revealWord,
      disabled: won,
      style: {
        opacity: won ? 0.5 : 1,
        cursor: won ? 'not-allowed' : 'pointer'
      }
    }, '💡 RÉVÉLER UN MOT')
  );

  // Affichage de la citation
  const quoteDisplay = React.createElement('div', {
    className: 'glass',
    style: {
      padding: '3rem 2rem',
      borderRadius: '16px',
      marginBottom: '3rem',
      textAlign: 'center',
      border: '2px solid rgba(200, 170, 110, 0.3)',
      background: 'linear-gradient(135deg, rgba(200, 170, 110, 0.05), rgba(240, 230, 210, 0.05))',
      position: 'relative',
      overflow: 'hidden'
    }
  },
    // Icône décorative
    React.createElement('div', {
      style: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        fontSize: '4rem',
        opacity: 0.1
      }
    }, '"'),
    
    React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        fontSize: '4rem',
        opacity: 0.1,
        transform: 'rotate(180deg)'
      }
    }, '"'),
    
    // Citation
    React.createElement('p', {
      style: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#f0e6d2',
        lineHeight: 1.6,
        fontStyle: 'italic',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 1,
        marginBottom: '1rem'
      }
    }, `"${getDisplayQuote()}"`),
    
    // Compteur de tentatives
    guesses.length > 0 && React.createElement('div', {
      style: {
        fontSize: '0.875rem',
        color: 'rgba(240, 230, 210, 0.6)',
        fontWeight: 600,
        marginTop: '1rem'
      }
    }, `${guesses.length} tentative${guesses.length > 1 ? 's' : ''}`)
  );

  // Barre de recherche
  const searchBar = !won && React.createElement('div', { 
    className: 'glass', 
    style: { padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' } 
  },
    React.createElement('div', { className: 'search-container' },
      React.createElement('input', {
        type: 'text',
        className: 'search-input',
        value: searchInput,
        onChange: e => setSearchInput(e.target.value),
        onFocus: () => setShowDropdown(true),
        onBlur: () => setTimeout(() => setShowDropdown(false), 200),
        placeholder: 'Qui a dit ça ?...'
      }),
      showDropdown && React.createElement(SearchDropdown, {
        champions: champions.filter(c => !guesses.some(g => g.id === c.id) && hasQuotes(c.id)),
        searchInput,
        onSelect: handleGuess,
        version
      })
    )
  );

  // Historique des tentatives
  const guessHistory = guesses.length > 0 && React.createElement('div', {
    className: 'glass',
    style: {
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem'
    }
  },
    React.createElement('h3', {
      style: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#c8aa6e',
        marginBottom: '1rem',
        textAlign: 'center'
      }
    }, `Tentatives (${guesses.length})`),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }
    },
      [...guesses].reverse().map((guess, idx) => 
        React.createElement('div', {
          key: idx,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: guess.isCorrect 
              ? 'rgba(16, 185, 129, 0.15)' 
              : 'rgba(239, 68, 68, 0.15)',
            border: `2px solid ${guess.isCorrect 
              ? 'rgba(16, 185, 129, 0.4)' 
              : 'rgba(239, 68, 68, 0.4)'}`,
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }
        },
          React.createElement('img', {
            src: DDRAGON.champIcon(version, guess.id),
            alt: guess.nom,
            style: {
              width: '48px',
              height: '48px',
              borderRadius: '6px'
            }
          }),
          React.createElement('div', {
            style: {
              flex: 1,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#f0e6d2'
            }
          }, guess.nom),
          React.createElement('div', {
            style: {
              fontSize: '1.5rem'
            }
          }, guess.isCorrect ? '✅' : '❌')
        )
      )
    )
  );

  // Écran de victoire
  const victoryScreen = won && React.createElement(VictoryScreen, {
    target,
    guesses,
    onNextGame: reset,
    onNextMode: onNextMode,
    version,
    currentMode: currentMode
  });

  return React.createElement('div', null,
    controlButtons,
    quoteDisplay,
    searchBar,
    guessHistory,
    victoryScreen,
    React.createElement(CitationsRulesModal, { 
      isOpen: showRules, 
      onClose: () => setShowRules(false) 
    })
  );
}