// Modal des règles
function SplashartRulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    },
    onClick: onClose
  },
    React.createElement('div', {
      style: {
        background: '#1a1a1a',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%',
        color: '#f0e6d2',
        overflowY: 'auto',
        maxHeight: '90vh',
        position: 'relative',
        border: '2px solid rgba(200, 170, 110, 0.3)'
      },
      onClick: (e) => e.stopPropagation()
    },
      React.createElement('button', {
        onClick: onClose,
        style: {
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'transparent',
          border: 'none',
          color: '#c8aa6e',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }
      }, '✖'),
      React.createElement('h2', { 
        style: { 
          color: '#c8aa6e', 
          marginBottom: '1rem',
          fontSize: '1.8rem'
        } 
      }, '📖 Règles du Mode Splashart'),
      React.createElement('p', { 
        style: { marginBottom: '1.5rem', lineHeight: '1.6' } 
      }, 
        "Devine le champion à partir d'un splashart zoomé ! L'image se dézoome à chaque mauvaise tentative, puis devine le nom du skin."
      ),
      React.createElement('h3', { 
        style: { 
          color: '#c8aa6e', 
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontSize: '1.3rem'
        } 
      }, '🎯 Comment jouer ?'),
      React.createElement('ul', { 
        style: { 
          listStyle: 'none', 
          padding: 0,
          marginBottom: '1.5rem'
        } 
      },
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '🔍 L\'image commence très zoomée'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '❌ Chaque mauvaise réponse dézoome l\'image'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '✅ Trouve le champion en un minimum de tentatives'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '👕 Ensuite devine quel skin est affiché !'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '⭐ Victoire parfaite si tu devines champion ET skin !')
      ),
      React.createElement('h3', { 
        style: { 
          color: '#c8aa6e', 
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontSize: '1.3rem'
        } 
      }, '💡 Conseils'),
      React.createElement('ul', { 
        style: { 
          listStyle: 'none', 
          padding: 0 
        } 
      },
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '🎨 Observe les couleurs et textures'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '⚔️ Cherche des éléments caractéristiques'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '✨ Les effets visuels sont uniques'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '🌈 Chaque zoom révèle plus d\'indices'),
        React.createElement('li', { style: { marginBottom: '0.5rem' } }, '👑 Les thèmes des skins donnent des indices')
      ),
      React.createElement('p', { 
        style: { 
          marginTop: '1.5rem', 
          fontWeight: 600, 
          textAlign: 'center', 
          color: '#c8aa6e',
          fontSize: '1.1rem'
        } 
      }, '🎮 Bonne chance, invocateur ! 🏆')
    )
  );
}

// Dropdown de recherche
function SearchDropdown({ champions, searchInput, onSelect, version }) {
  const filtered = champions.filter(c =>
    c.nom.toLowerCase().includes(searchInput.toLowerCase())
  ).slice(0, 8);

  if (filtered.length === 0 || !searchInput) return null;

  return React.createElement('div', {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: '#1a1a1a',
      border: '2px solid rgba(200, 170, 110, 0.3)',
      borderRadius: '8px',
      marginTop: '0.5rem',
      maxHeight: '300px',
      overflowY: 'auto',
      zIndex: 100
    }
  },
    filtered.map(champ =>
      React.createElement('div', {
        key: champ.id,
        onClick: () => onSelect(champ),
        onMouseEnter: (e) => e.currentTarget.style.background = 'rgba(200, 170, 110, 0.1)',
        onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
        style: {
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(200, 170, 110, 0.1)',
          transition: 'background 0.2s'
        }
      },
        React.createElement('img', {
          src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.id}.png`,
          alt: champ.nom,
          style: { width: '40px', height: '40px', borderRadius: '6px' }
        }),
        React.createElement('span', {
          style: { color: '#f0e6d2', fontWeight: 500 }
        }, champ.nom)
      )
    )
  );
}

// Fonction pour charger les détails d'un champion
async function loadChampionDetails(championId, version) {
  try {
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${championId}.json`);
    const data = await response.json();
    return data.data[championId];
  } catch (error) {
    console.error(`Erreur pour ${championId}:`, error);
    return null;
  }
}

function SplashartMode({ champions, version, resetFlag, setShowSettings, onNextMode, currentMode }) {
  const [allSkinsData, setAllSkinsData] = React.useState([]);
  const [targetSkin, setTargetSkin] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [guesses, setGuesses] = React.useState([]);
  const [championFound, setChampionFound] = React.useState(false);
  const [skinGuessed, setSkinGuessed] = React.useState(null);
  const [gameComplete, setGameComplete] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [skinSearchInput, setSkinSearchInput] = React.useState('');
  const [skinAttempts, setSkinAttempts] = React.useState([]);

  const MAX_ATTEMPTS = 100;
  const ZOOM_LEVELS = [750, 725, 700, 675, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100];

  // Charger tous les skins de tous les champions au démarrage
  React.useEffect(() => {
    const loadAllSkins = async () => {
      if (!champions || champions.length === 0) return;
      
      setLoading(true);
      const allSkins = [];
      
      for (let i = 0; i < champions.length; i++) {
        const champ = champions[i];
        setLoadingProgress(Math.round((i / champions.length) * 100));
        
        try {
          const details = await loadChampionDetails(champ.id, version);
          
          if (details && details.skins && details.skins.length > 0) {
            details.skins.forEach(skin => {
              allSkins.push({
                championId: champ.id,
                championNom: champ.nom,
                skinNum: skin.num,
                skinName: skin.name === 'default' ? `${champ.nom} (Original)` : skin.name
              });
            });
          }
        } catch (error) {
          console.error(`Erreur pour ${champ.id}:`, error);
        }
      }
      
      setAllSkinsData(allSkins);
      setLoading(false);
    };
    
    loadAllSkins();
  }, [champions, version]);

  // Calcul du niveau de zoom basé sur le nombre de tentatives
  const getZoomLevel = () => {
    const attempts = guesses.length;
    return ZOOM_LEVELS[Math.min(attempts, ZOOM_LEVELS.length - 1)];
  };

  // Reset et sélection d'un skin aléatoire parmi tous les skins
  const reset = React.useCallback(() => {
    if (allSkinsData.length === 0) return;
    
    const randomSkin = allSkinsData[Math.floor(Math.random() * allSkinsData.length)];
    setTargetSkin(randomSkin);
    setSearchInput('');
    setShowDropdown(false);
    setGuesses([]);
    setChampionFound(false);
    setSkinGuessed(null);
    setGameComplete(false);
    setSkinSearchInput('');
    setSkinAttempts([]);
  }, [allSkinsData]);

  React.useEffect(() => { 
    if (allSkinsData.length > 0) {
      reset(); 
    }
  }, [reset, resetFlag, allSkinsData]);

  const handleGuess = (champ) => {
    if (championFound || !targetSkin) return;
    if (guesses.some(g => g.id === champ.id)) return;
    
    const isCorrect = champ.id === targetSkin.championId;
    const newGuesses = [...guesses, { ...champ, isCorrect }];
    setGuesses(newGuesses);
    setSearchInput('');
    setShowDropdown(false);
    
    if (isCorrect) {
      setChampionFound(true);
    }
  };

  const handleSkinGuess = (skinNum) => {
    setSkinGuessed(skinNum);
    setGameComplete(true);
  };

  const handleSkinTextGuess = () => {
    if (!skinSearchInput.trim()) return;
    
    const userGuess = skinSearchInput.trim().toLowerCase();
    const correctSkinName = targetSkin.skinName.toLowerCase();
    
    const isCorrect = userGuess === correctSkinName;
    
    setSkinAttempts([...skinAttempts, { guess: skinSearchInput, isCorrect }]);
    
    if (isCorrect) {
      handleSkinGuess(targetSkin.skinNum);
    }
    
    setSkinSearchInput('');
  };

  const getSplashartUrl = () => {
    if (!targetSkin) return '';
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${targetSkin.championId}_${targetSkin.skinNum}.jpg`;
  };

  if (loading) {
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
      React.createElement('div', { style: { fontSize: '3rem' } }, '🖼️'),
      React.createElement('div', { style: { fontSize: '1.5rem', color: '#c8aa6e' } }, 'Chargement des splasharts...'),
      React.createElement('div', { style: { fontSize: '1rem', color: '#f0e6d2' } }, `${loadingProgress}%`),
      React.createElement('div', { 
        style: { 
          width: '300px', 
          height: '10px', 
          background: 'rgba(200, 170, 110, 0.2)', 
          borderRadius: '5px', 
          overflow: 'hidden' 
        } 
      },
        React.createElement('div', { 
          style: { 
            width: `${loadingProgress}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #c8aa6e, #a88c5a)', 
            transition: 'width 0.3s ease' 
          } 
        })
      )
    );
  }

  if (!targetSkin) {
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
      React.createElement('div', { style: { fontSize: '3rem' } }, '🖼️'),
      React.createElement('div', { style: { fontSize: '1.5rem', color: '#c8aa6e' } }, 'Chargement...')
    );
  }

  const currentZoom = getZoomLevel();

  // Bouton règles
  const rulesButton = React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    }
  },
    React.createElement('button', {
      className: 'btn btn-secondary',
      onClick: () => setShowRules(true)
    }, '📖 RÈGLES')
  );

  // Compteur de tentatives
  const attemptsCounter = React.createElement('div', {
    style: {
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.2rem',
      fontWeight: 600,
      color: guesses.length >= MAX_ATTEMPTS - 1 ? '#ef4444' : '#c8aa6e'
    }
  }, `Tentatives : ${guesses.length} / ${MAX_ATTEMPTS}`);

  // Affichage du splashart avec zoom
  const splashartDisplay = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
      gap: '1rem'
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
    }, championFound ? '✅ Champion trouvé ! Devine le skin' : 'Devine le champion'),
    
    React.createElement('div', {
      style: {
        position: 'relative',
        width: '550px',
        maxWidth: '85vw',
        height: '310px',
        borderRadius: '16px',
        border: '4px solid rgba(200, 170, 110, 0.6)',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(200, 170, 110, 0.4)',
        transition: 'all 0.5s ease',
        background: '#000'
      }
    },
      React.createElement('div', {
        style: {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      },
        React.createElement('img', {
          src: getSplashartUrl(),
          alt: 'Splashart mystère',
          style: {
            width: `${currentZoom}%`,
            height: `${currentZoom}%`,
            objectFit: 'cover',
            transition: 'all 0.8s ease'
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
    React.createElement('div', { 
      className: 'search-container',
      style: { position: 'relative' }
    },
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

  // Historique des tentatives (inversé)
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
            src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${guess.id}.png`,
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

  // Phase de devinette du skin (input texte)
  const skinGuessPhase = championFound && !gameComplete && React.createElement('div', {
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
    }, `✅ Champion trouvé : ${targetSkin.championNom}`),
    
    React.createElement('p', {
      style: {
        fontSize: '1.25rem',
        color: '#c8aa6e',
        marginBottom: '2rem',
        fontWeight: 600
      }
    }, '🎯 Maintenant, devine quel skin est affiché !'),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        gap: '0.75rem',
        maxWidth: '500px',
        margin: '0 auto 2rem'
      }
    },
      React.createElement('input', {
        type: 'text',
        className: 'search-input',
        value: skinSearchInput,
        onChange: (e) => setSkinSearchInput(e.target.value),
        onKeyPress: (e) => e.key === 'Enter' && handleSkinTextGuess(),
        placeholder: 'Nom du skin...',
        style: {
          flex: 1
        }
      }),
      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: handleSkinTextGuess,
        style: {
          padding: '0.75rem 1.5rem',
          whiteSpace: 'nowrap'
        }
      }, '✅ VALIDER')
    ),
    
    skinAttempts.length > 0 && React.createElement('div', {
      style: {
        marginTop: '1.5rem'
      }
    },
      React.createElement('h4', {
        style: {
          fontSize: '1rem',
          color: '#c8aa6e',
          marginBottom: '0.75rem'
        }
      }, 'Tentatives de skin :'),
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '400px',
          margin: '0 auto'
        }
      },
        [...skinAttempts].reverse().map((attempt, idx) =>
          React.createElement('div', {
            key: idx,
            style: {
              padding: '0.75rem',
              borderRadius: '8px',
              background: attempt.isCorrect 
                ? 'rgba(16, 185, 129, 0.15)' 
                : 'rgba(239, 68, 68, 0.15)',
              border: `2px solid ${attempt.isCorrect 
                ? 'rgba(16, 185, 129, 0.4)' 
                : 'rgba(239, 68, 68, 0.4)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          },
            React.createElement('span', {
              style: {
                color: '#f0e6d2',
                fontWeight: 500
              }
            }, attempt.guess),
            React.createElement('span', {
              style: {
                fontSize: '1.25rem'
              }
            }, attempt.isCorrect ? '✅' : '❌')
          )
        )
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
      border: skinGuessed === targetSkin.skinNum
        ? '2px solid rgba(16, 185, 129, 0.6)'
        : '2px solid rgba(245, 158, 11, 0.6)',
      background: skinGuessed === targetSkin.skinNum
        ? 'rgba(16, 185, 129, 0.05)'
        : 'rgba(245, 158, 11, 0.05)',
      animation: 'victoryPulse 0.6s ease-out'
    }
  },
    React.createElement('div', {
      style: { fontSize: '4rem', marginBottom: '1rem' }
    }, skinGuessed === targetSkin.skinNum ? '🏆' : '🎯'),
    
    React.createElement('h3', {
      style: {
        fontSize: '2.5rem',
        fontWeight: 800,
        background: skinGuessed === targetSkin.skinNum
          ? 'linear-gradient(135deg, #10b981, #34d399)'
          : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }
    }, skinGuessed === targetSkin.skinNum ? 'VICTOIRE PARFAITE !' : 'CHAMPION TROUVÉ !'),
    
    React.createElement('p', {
      style: {
        fontSize: '1.25rem',
        color: 'rgba(240, 230, 210, 0.8)',
        marginBottom: '1.5rem'
      }
    }, 
      skinGuessed === targetSkin.skinNum
        ? `🏆 Bravo ! Tu as trouvé ${targetSkin.championNom} en ${guesses.length} tentative${guesses.length > 1 ? 's' : ''} ET deviné que c'était le skin "${targetSkin.skinName}" !`
        : `Champion trouvé en ${guesses.length} tentative${guesses.length > 1 ? 's' : ''}, mais le skin était : ${targetSkin.skinName}`
    ),
    
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }
    },
      React.createElement('div', {
        style: {
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#c8aa6e'
        }
      }, `C'était : ${targetSkin.skinName}`)
    ),
    
    React.createElement('div', { className: 'victory-splash' },
      React.createElement('img', {
        src: getSplashartUrl(),
        alt: targetSkin.skinName,
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
    rulesButton,
    attemptsCounter,
    splashartDisplay,
    searchBar,
    guessHistory,
    skinGuessPhase,
    resultScreen,
    React.createElement(SplashartRulesModal, { 
      isOpen: showRules, 
      onClose: () => setShowRules(false) 
    })
  );
}