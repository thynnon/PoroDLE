// classique.js - Mode Classique (sans navigation)

function ClassicMode({ champions, version, resetFlag, setShowSettings, onNextMode, currentMode }) {
  const [target, setTarget] = React.useState(null);
  const [guesses, setGuesses] = React.useState([]);
  const [won, setWon] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showLegend, setShowLegend] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);

  // Reset le jeu
  const reset = React.useCallback(() => {
    if (!champions || champions.length === 0) return;
    const random = champions[Math.floor(Math.random() * champions.length)];
    setTarget(random);
    setGuesses([]);
    setWon(false);
    setSearchInput('');
    setShowDropdown(false);
  }, [champions]);

  // Reset au montage et quand resetFlag change
  React.useEffect(() => { 
    reset(); 
  }, [reset, resetFlag]);

  // Gestion des tentatives
  const handleGuess = (champ) => {
    if (won || !target) return;
    if (guesses.some(g => g.id === champ.id)) return;

    const isCorrect = champ.id === target.id;
    const newGuess = { ...champ, revealedCells: 0 };
    setGuesses(prev => [newGuess, ...prev]);
    setSearchInput('');

    if (isCorrect) {
      // Attendre que toutes les cellules de la ligne gagnante soient révélées
      setTimeout(() => {
        setWon(true);
        setShowDropdown(false);
      }, 8 * 250 + 300); // 8 cellules * 250ms + 300ms de marge
    }
  };

  // Animation progressive des cellules
  React.useEffect(() => {
    if (guesses.length === 0) return;

    // Animer toutes les lignes qui n'ont pas fini leur animation
    const timers = guesses.map((guess, index) => {
      if (guess.revealedCells >= 8) return null;

      return setTimeout(() => {
        setGuesses(prev => {
          const updated = [...prev];
          if (updated[index] && updated[index].revealedCells < 8) {
            updated[index] = { ...updated[index], revealedCells: updated[index].revealedCells + 1 };
          }
          return updated;
        });
      }, 250);
    });

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [guesses]);

  if (!target) {
    return React.createElement('div', { 
      style: { textAlign: 'center', padding: '3rem' } 
    }, 'Chargement...');
  }

  // Boutons règles et légende
  const controlButtons = React.createElement('div', { 
    style: { 
      display: 'flex', 
      gap: '0.75rem', 
      flexWrap: 'wrap', 
      justifyContent: 'center',
      marginBottom: '2rem'
    } 
  },
    React.createElement('button', { 
      className: 'btn btn-secondary', 
      onClick: () => setShowRules(true)
    }, '📖 RÈGLES'),
    React.createElement('button', { 
      className: 'btn btn-secondary', 
      onClick: () => setShowLegend(!showLegend) 
    }, '❓ LÉGENDE')
  );

  // Légende
  const legend = React.createElement(Legend, { show: showLegend });

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
        placeholder: 'Rechercher un champion...'
      }),
      showDropdown && React.createElement(SearchDropdown, {
        champions: champions.filter(c => !guesses.some(g => g.id === c.id)),
        searchInput,
        onSelect: handleGuess,
        version
      })
    )
  );

  // Grille des résultats avec animation
  const resultsGrid = guesses.length > 0 && React.createElement(
    'div',
    { className: 'glass', style: { padding: '1.5rem', borderRadius: '12px' } },
    React.createElement('div', { className: 'grid-headers' },
      ['CHAMPION', 'GENRE', 'POSITION', 'ESPÈCE', 'RESSOURCE', 'PORTÉE', 'RÉGION', 'ANNÉE'].map(h =>
        React.createElement('div', { key: h, className: 'grid-header' }, h)
      )
    ),
    React.createElement('div', { className: 'results-grid' },
      guesses.map((guess, idx) => {
        const cells = [
          { value: DDRAGON.champIcon(version, guess.id), type: 'img' },
          { value: guess.sex, status: compareAttr(guess.sex, target.sex) },
          { value: guess.position, status: compareAttr(guess.position, target.position) },
          { value: guess.species, status: compareAttr(guess.species, target.species) },
          { value: guess.partype, status: compareAttr(guess.partype, target.partype) },
          { 
            value: isRanged(guess) ? 'Distance' : 'Mêlée', 
            status: compareAttr(
              isRanged(guess) ? 'Distance' : 'Mêlée', 
              isRanged(target) ? 'Distance' : 'Mêlée'
            ) 
          },
          { value: guess.region, status: compareAttr(guess.region, target.region) },
          { 
            value: guess.year, 
            status: compareAttr(guess.year, target.year, 'year'), 
            arrow: getArrow(guess.year, target.year) 
          }
        ];

        return React.createElement(
          'div',
          { key: idx, className: 'result-row' },
          cells.map((cell, i) => {
            if (i >= guess.revealedCells) {
              return React.createElement('div', { 
                key: i, 
                className: 'result-cell hidden' 
              });
            }
            
            // La classe 'champion' est seulement pour la première cellule (image)
            const cellClasses = `result-cell ${cell.status || ''}${i === 0 ? ' champion' : ''}`;
            
            return React.createElement(
              'div',
              { key: i, className: cellClasses },
              cell.type === 'img'
                ? React.createElement('img', { src: cell.value, alt: guess.nom })
                : React.createElement('div', { className: 'result-cell-text' }, 
                    cell.value + (cell.arrow || '')
                  )
            );
          })
        );
      })
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
    legend,
    searchBar,
    resultsGrid,
    victoryScreen,
    React.createElement(RulesModal, { 
      isOpen: showRules, 
      onClose: () => setShowRules(false) 
    })
  );
}