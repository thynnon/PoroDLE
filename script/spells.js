// spells.js - Mode Sorts avec phase de devinette

// Modal des règles pour le mode Spells
function SpellsRulesModal({ isOpen, onClose }) {
  return React.createElement(Modal, { isOpen, onClose, title: '📖 Règles du Mode Sorts' },
    React.createElement('p', null, 
      'Devine le champion en observant UN SEUL de ses sorts ! À chaque partie, un sort aléatoire (Passif, Q, W, E ou R) est sélectionné.'
    ),
    
    React.createElement('h3', null, '🎯 Comment jouer ?'),
    React.createElement('ul', null,
      React.createElement('li', null, '👁️ Un seul sort est affiché par partie'),
      React.createElement('li', null, '🎲 Le sort est choisi aléatoirement (Passif, Q, W, E ou R)'),
      React.createElement('li', null, '🔍 Observe bien l\'icône pour deviner le champion'),
      React.createElement('li', null, '🏆 Trouve le champion puis devine quel sort était affiché'),
      React.createElement('li', null, '⭐ Victoire parfaite si tu devines champion ET sort !')
    ),
    
    React.createElement('h3', null, '🎮 Options de difficulté'),
    React.createElement('ul', null,
      React.createElement('li', null,
        React.createElement('span', { className: 'color-indicator', style: { background: 'linear-gradient(to right, #000, #fff)', display: 'inline-block', width: '16px', height: '16px', borderRadius: '4px', marginRight: '8px', verticalAlign: 'middle' } }),
        'Noir & Blanc : Le sort est affiché en niveaux de gris'
      ),
      React.createElement('li', null,
        React.createElement('span', { style: { display: 'inline-block', marginRight: '8px' } }, '🔄'),
        'Rotation : Le sort est tourné aléatoirement (90°, 180° ou 270°)'
      ),
      React.createElement('li', null, '💡 Tu peux activer/désactiver ces options à tout moment')
    ),
    
    React.createElement('h3', null, '📊 Types de sorts possibles'),
    React.createElement('ul', null,
      React.createElement('li', null, '⚡ Passif - La capacité passive du champion'),
      React.createElement('li', null, '🔵 Sort Q - Première compétence'),
      React.createElement('li', null, '🟢 Sort W - Deuxième compétence'),
      React.createElement('li', null, '🟡 Sort E - Troisième compétence'),
      React.createElement('li', null, '🔴 Sort R - Ultime')
    ),
    
    React.createElement('h3', null, '🏆 Système de victoire'),
    React.createElement('ul', null,
      React.createElement('li', null, '🎉 Victoire Parfaite : Champion trouvé + Sort correct'),
      React.createElement('li', null, '🎯 Champion Trouvé : Champion trouvé mais sort incorrect')
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
      '🔥 Un sort, un champion, un défi ! 🎯'
    )
  );
}

function SpellsMode({ champions, version, resetFlag, setShowSettings, onNextMode, currentMode }) {
  const [target, setTarget] = React.useState(null);
  const [targetDetails, setTargetDetails] = React.useState(null);
  const [selectedSpell, setSelectedSpell] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [guesses, setGuesses] = React.useState([]);
  const [championFound, setChampionFound] = React.useState(false);
  const [spellGuessed, setSpellGuessed] = React.useState(null);
  const [gameComplete, setGameComplete] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [grayscaleMode, setGrayscaleMode] = React.useState(false);
  const [rotationMode, setRotationMode] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);
  const [spellRotation, setSpellRotation] = React.useState(0);

  // Reset le jeu
  const reset = React.useCallback(async () => {
    if (!champions || champions.length === 0) return;
    
    setLoading(true);
    const random = champions[Math.floor(Math.random() * champions.length)];
    setTarget(random);
    
    const randomSpell = Math.floor(Math.random() * 5);
    setSelectedSpell(randomSpell);
    
    const details = await loadChampionDetails(random.id, version);
    setTargetDetails(details);
    setLoading(false);
    
    setGuesses([]);
    setChampionFound(false);
    setSpellGuessed(null);
    setGameComplete(false);
    setSearchInput('');
    setShowDropdown(false);
    
    const rotations = [90, 180, 270];
    setSpellRotation(rotations[Math.floor(Math.random() * rotations.length)]);
  }, [champions, version]);

  React.useEffect(() => { 
    reset(); 
  }, [reset, resetFlag]);

  const handleGuess = (champ) => {
    if (championFound || !target) return;
    if (guesses.some(g => g.id === champ.id)) return;
    
    const isCorrect = champ.id === target.id;
    setGuesses(prev => [...prev, { ...champ, isCorrect }]);
    setSearchInput('');
    setShowDropdown(false);
    
    if (isCorrect) {
      setChampionFound(true);
    }
  };

  const handleSpellGuess = (spellIndex) => {
    setSpellGuessed(spellIndex);
    setGameComplete(true);
  };

  const getSpellIcon = () => {
    if (!targetDetails || !targetDetails.spells || selectedSpell === null) return '';
    
    if (selectedSpell === 0) {
      const passiveImage = targetDetails.spells.passive?.image;
      if (!passiveImage) return '';
      return `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${passiveImage}`;
    }
    
    const spellMap = {
      1: targetDetails.spells.Q?.image,
      2: targetDetails.spells.W?.image,
      3: targetDetails.spells.E?.image,
      4: targetDetails.spells.R?.image
    };
    
    const imageName = spellMap[selectedSpell];
    if (!imageName) return '';
    
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${imageName}`;
  };

  const getSpellName = () => {
    if (selectedSpell === null) return '';
    const names = ['Passif', 'Sort Q', 'Sort W', 'Sort E', 'Sort R'];
    return names[selectedSpell];
  };

  if (!target || loading || !targetDetails) {
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
      React.createElement('div', { style: { fontSize: '3rem' } }, '⚡'),
      React.createElement('div', { style: { fontSize: '1.5rem', color: '#c8aa6e' } }, 'Chargement des sorts...')
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
      }, '🎨 Noir & Blanc'),
      React.createElement('div', {
        className: `settings-toggle ${grayscaleMode ? 'active' : ''}`,
        onClick: () => setGrayscaleMode(!grayscaleMode),
        style: { cursor: 'pointer' }
      },
        React.createElement('div', { className: 'settings-toggle-thumb' })
      )
    ),
    
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
      }, '🔄 Rotation'),
      React.createElement('div', {
        className: `settings-toggle ${rotationMode ? 'active' : ''}`,
        onClick: () => setRotationMode(!rotationMode),
        style: { cursor: 'pointer' }
      },
        React.createElement('div', { className: 'settings-toggle-thumb' })
      )
    )
  );

  // Affichage du sort
  const spellDisplay = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '3rem',
      gap: '1.5rem'
    }
  },
    React.createElement('h3', {
      style: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#c8aa6e',
        textTransform: 'uppercase',
        letterSpacing: '0.1rem'
      }
    }, championFound ? '✅ Champion trouvé ! Devine le sort' : `Devine le champion avec ce sort`),
    
    React.createElement('div', {
      style: {
        position: 'relative',
        width: '200px',
        height: '200px'
      }
    },
      React.createElement('div', {
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          border: '4px solid rgba(200, 170, 110, 0.6)',
          background: 'rgba(240, 230, 210, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(200, 170, 110, 0.4)',
          transition: 'all 0.3s ease'
        }
      },
        React.createElement('img', {
          src: getSpellIcon(),
          alt: 'Sort mystère',
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: grayscaleMode ? 'grayscale(100%)' : 'none',
            transform: rotationMode ? `rotate(${spellRotation}deg)` : 'rotate(0deg)',
            transition: 'all 0.3s ease'
          }
        })
      )
    )
  );

  // Barre de recherche
  const searchBar = !championFound && React.createElement('div', { 
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

  // Phase de devinette du sort
  const spellGuessPhase = championFound && !gameComplete && React.createElement('div', {
    className: 'glass',
    style: {
      padding: '2rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      textAlign: 'center',
      animation: 'slideIn 0.5s ease-out'
    }
  },
    React.createElement('h3', {
      style: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#10b981',
        marginBottom: '1rem',
        textTransform: 'uppercase'
      }
    }, `✅ Champion trouvé : ${target.nom}`),
    
    React.createElement('p', {
      style: {
        fontSize: '1.25rem',
        color: '#c8aa6e',
        marginBottom: '2rem',
        fontWeight: 600
      }
    }, '🎯 Maintenant, devine quel sort était affiché !'),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }
    },
      ['Passif', 'Q', 'W', 'E', 'R'].map((spellName, index) =>
        React.createElement('button', {
          key: index,
          className: 'btn btn-primary',
          onClick: () => handleSpellGuess(index),
          style: {
            fontSize: '1.1rem',
            padding: '1rem 2rem',
            minWidth: '120px',
            transition: 'all 0.2s ease'
          }
        }, spellName)
      )
    )
  );

  // Écran de résultat final
  const resultScreen = gameComplete && React.createElement('div', {
    className: 'glass',
    style: {
      padding: '3rem 2rem',
      borderRadius: '16px',
      textAlign: 'center',
      border: spellGuessed === selectedSpell 
        ? '2px solid rgba(16, 185, 129, 0.6)'
        : '2px solid rgba(245, 158, 11, 0.6)',
      background: spellGuessed === selectedSpell
        ? 'rgba(16, 185, 129, 0.05)'
        : 'rgba(245, 158, 11, 0.05)',
      animation: 'victoryPulse 0.6s ease-out'
    }
  },
    React.createElement('div', {
      style: { fontSize: '4rem', marginBottom: '1rem' }
    }, spellGuessed === selectedSpell ? '🎉' : '🎯'),
    
    React.createElement('h3', {
      style: {
        fontSize: '2.5rem',
        fontWeight: 800,
        background: spellGuessed === selectedSpell
          ? 'linear-gradient(135deg, #10b981, #34d399)'
          : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }
    }, spellGuessed === selectedSpell ? 'VICTOIRE PARFAITE !' : 'CHAMPION TROUVÉ !'),
    
    React.createElement('p', {
      style: {
        fontSize: '1.25rem',
        color: 'rgba(240, 230, 210, 0.8)',
        marginBottom: '1.5rem'
      }
    }, 
      spellGuessed === selectedSpell 
        ? `🏆 Bravo ! Tu as trouvé ${target.nom} en ${guesses.length} tentative${guesses.length > 1 ? 's' : ''} ET deviné que c'était le ${getSpellName()} !`
        : `Champion trouvé en ${guesses.length} tentative${guesses.length > 1 ? 's' : ''}, mais le sort était : ${getSpellName()}`
    ),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem'
      }
    },
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }
      },
        React.createElement('img', {
          src: getSpellIcon(),
          alt: getSpellName(),
          style: {
            width: '120px',
            height: '120px',
            borderRadius: '12px',
            border: '3px solid rgba(200, 170, 110, 0.6)',
            boxShadow: '0 0 20px rgba(200, 170, 110, 0.3)'
          }
        }),
        React.createElement('div', {
          style: {
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#c8aa6e'
          }
        }, `C'était le ${getSpellName()}`)
      )
    ),
    
    React.createElement('div', { className: 'victory-splash' },
      React.createElement('img', {
        src: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${target.id}_0.jpg`,
        alt: target.nom,
        style: { width: '100%', display: 'block' }
      })
    ),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: '2rem',
        flexWrap: 'wrap'
      }
    },
      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: reset,
        style: {
          fontSize: '1.1rem',
          padding: '1rem 2rem'
        }
      }, '🔄 NOUVELLE PARTIE'),
      React.createElement('button', {
        className: 'btn btn-secondary',
        onClick: () => {
          const modes = ['CLASSIQUE', 'CITATIONS', 'SPELLS', 'ITEMS', 'SUDOKU'];
          const currentIndex = modes.indexOf(currentMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          onNextMode && onNextMode(modes[nextIndex]);
        },
        style: {
          fontSize: '1.1rem',
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #c8aa6e, #a88c5a)',
          color: '#0a0e12',
          border: 'none'
        }
      }, '➡️ JEU SUIVANT')
    )
  );

  return React.createElement('div', null,
    controlButtons,
    spellDisplay,
    searchBar,
    guessHistory,
    spellGuessPhase,
    resultScreen,
    React.createElement(SpellsRulesModal, { 
      isOpen: showRules, 
      onClose: () => setShowRules(false) 
    })
  );
}