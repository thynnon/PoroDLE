// spells.js - Mode Sorts

function SpellsMode({ champions, version, resetFlag, setShowSettings }) {
  const [target, setTarget] = React.useState(null);
  const [guesses, setGuesses] = React.useState([]);
  const [won, setWon] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [hardMode, setHardMode] = React.useState(false);
  const [revealedSpells, setRevealedSpells] = React.useState([]);
  const [currentSpellIndex, setCurrentSpellIndex] = React.useState(0);

  // Reset le jeu
  const reset = React.useCallback(() => {
    if (!champions || champions.length === 0) return;
    const random = champions[Math.floor(Math.random() * champions.length)];
    setTarget(random);
    setGuesses([]);
    setWon(false);
    setSearchInput('');
    setShowDropdown(false);
    setRevealedSpells([0]); // Révèle le premier sort (passif)
    setCurrentSpellIndex(0);
  }, [champions]);

  React.useEffect(() => { 
    reset(); 
  }, [reset, resetFlag]);

  const handleGuess = (champ) => {
    if (won || !target) return;
    if (guesses.some(g => g.id === champ.id)) return;
    
    const isCorrect = champ.id === target.id;
    setGuesses(prev => [...prev, { ...champ, isCorrect }]);
    setSearchInput('');
    setShowDropdown(false);
    
    if (isCorrect) {
      setWon(true);
    } else {
      // Révèle le sort suivant après une mauvaise réponse
      const nextIndex = currentSpellIndex + 1;
      if (nextIndex < 5) {
        setTimeout(() => {
          setRevealedSpells(prev => [...prev, nextIndex]);
          setCurrentSpellIndex(nextIndex);
        }, 500);
      }
    }
  };

  const getSpellIcon = (spellKey) => {
    if (!target) return '';
    // Les sorts sont : passive (P), Q, W, E, R
    const spellMap = {
      0: target.id + 'P', // Passif
      1: target.id + 'Q',
      2: target.id + 'W',
      3: target.id + 'E',
      4: target.id + 'R'
    };
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellMap[spellKey]}.png`;
  };

  const getSpellName = (index) => {
    const names = ['Passif', 'Q', 'W', 'E', 'R'];
    return names[index];
  };

  const getRandomRotation = () => {
    const rotations = [0, 90, 180, 270];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  if (!target) {
    return React.createElement('div', { 
      style: { textAlign: 'center', padding: '3rem' } 
    }, 'Chargement...');
  }

  // Toggle Hard Mode
  const hardModeToggle = React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      padding: '1rem',
      background: 'rgba(240, 230, 210, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(240, 230, 210, 0.1)'
    }
  },
    React.createElement('span', {
      style: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#f0e6d2'
      }
    }, '🔥 Mode Difficile'),
    React.createElement('div', {
      className: `settings-toggle ${hardMode ? 'active' : ''}`,
      onClick: () => setHardMode(!hardMode),
      style: { cursor: 'pointer' }
    },
      React.createElement('div', { className: 'settings-toggle-thumb' })
    ),
    React.createElement('span', {
      style: {
        fontSize: '0.875rem',
        color: 'rgba(240, 230, 210, 0.6)'
      }
    }, '(Noir & Blanc + Rotation)')
  );

  // Affichage des sorts
  const spellsDisplay = React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      marginBottom: '3rem',
      flexWrap: 'wrap'
    }
  },
    [0, 1, 2, 3, 4].map(index => {
      const isRevealed = revealedSpells.includes(index);
      const rotation = hardMode ? getRandomRotation() : 0;
      
      return React.createElement('div', {
        key: index,
        style: {
          position: 'relative',
          width: '120px',
          height: '120px'
        }
      },
        // Label du sort
        React.createElement('div', {
          style: {
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: isRevealed ? '#c8aa6e' : 'rgba(240, 230, 210, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.05rem'
          }
        }, getSpellName(index)),
        
        // Conteneur du sort
        React.createElement('div', {
          style: {
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            border: `3px solid ${isRevealed ? 'rgba(200, 170, 110, 0.5)' : 'rgba(240, 230, 210, 0.2)'}`,
            background: isRevealed ? 'rgba(240, 230, 210, 0.1)' : 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: isRevealed ? '0 0 20px rgba(200, 170, 110, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }
        },
          isRevealed 
            ? React.createElement('img', {
                src: getSpellIcon(index),
                alt: getSpellName(index),
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: hardMode ? 'grayscale(100%)' : 'none',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'all 0.3s ease'
                },
                onError: (e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML += '<div style="color: rgba(240, 230, 210, 0.5); font-size: 0.875rem;">N/A</div>';
                }
              })
            : React.createElement('div', {
                style: {
                  fontSize: '2rem',
                  color: 'rgba(240, 230, 210, 0.2)'
                }
              }, '🔒')
        )
      );
    })
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
        placeholder: 'Devine le champion...'
      }),
      showDropdown && React.createElement(SearchDropdown, {
        champions: champions.filter(c => !guesses.some(g => g.id === c.id)),
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
      guesses.map((guess, idx) => 
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
  const victoryScreen = won && React.createElement('div', { 
    className: 'glass victory-screen', 
    style: { borderRadius: '12px', marginTop: '2rem' } 
  },
    React.createElement('div', { className: 'victory-emoji' }, '🎉'),
    React.createElement('h3', { className: 'victory-title neon' }, 'BRAVO !'),
    React.createElement('p', { className: 'victory-text' }, 
      `Tu as trouvé ${target.nom} en ${guesses.length} tentative${guesses.length > 1 ? 's' : ''} !`
    ),
    React.createElement('div', { className: 'victory-splash' },
      React.createElement('img', { 
        src: DDRAGON.champSplash(target.id), 
        alt: target.nom 
      })
    )
  );

  return React.createElement('div', null,
    hardModeToggle,
    spellsDisplay,
    searchBar,
    guessHistory,
    victoryScreen
  );
}