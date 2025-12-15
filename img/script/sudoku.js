// sudoku.js – Mode Sudoku 3x3 avec contraintes logiques par ligne/colonne
function SudokuMode({
  champions = [],
  version = '14.1.1',
  resetFlag,
  setShowSettings,
  onNextMode,
  currentMode
}) {
  // Helpers pour compatibilité
  const getChampId = (c) => c.id || c.key || c.uuid || c.champId;
  const getChampName = (c) => c.nom || c.name || c.title || '';

  // États
  const [solution, setSolution] = React.useState([]);
  const [board, setBoard] = React.useState(Array(9).fill(null));
  const [topConstraints, setTopConstraints] = React.useState([]);
  const [leftConstraints, setLeftConstraints] = React.useState([]);
  const [won, setWon] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [showLegend, setShowLegend] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
  const [animating, setAnimating] = React.useState(false);
  const [searchFilter, setSearchFilter] = React.useState('');

  // Mapping des valeurs vers les images
  const getConstraintImage = (type, value) => {
    const basePath = './img';
    
    switch(type) {
      case 'role':
        // Classes/Rôles: Assassin.png, Mage.png, etc.
        return `${basePath}/classes_lol/${value}.png`;
      
      case 'lane':
        // Lanes: Jungle.png, Top.png, etc.
        return `${basePath}/lanes_lol/${value}.png`;
      
      case 'region':
        // Régions: Freljord_Crest_icon.png, Demacia_Crest_icon.png, etc.
        return `${basePath}/regions_lol/${value}_Crest_icon.png`;
      
      case 'gender':
        return `${basePath}/indices/${value.toLowerCase()}.png`;
      
      case 'rangeType':
        // Nouveau type: Mêlée ou Distance
        return value === 'Melee' 
          ? `${basePath}/indices/melee.png` 
          : `${basePath}/indices/ranged.png`;
      
      case 'species':
        // Nouveau type: Humain, Yordle, Vastaya, etc.
        return `${basePath}/indices/species_${value.toLowerCase()}.png`;
      
      case 'releaseYear':
        // Nouveau type: Année de sortie (2009-2024)
        return `${basePath}/indices/year_${value}.png`;
      
      default:
        return null;
    }
  };

  // Extraire les attributs d'un champion
  const getChampionAttributes = (champ) => {
    // Ces attributs doivent venir de tes données de champions
    // Pour l'instant, on utilise des valeurs par défaut
    return {
      role: champ.tags?.[0] || champ.role || 'Fighter',
      lane: champ.lane || champ.position || 'Mid',
      region: champ.region || champ.regions?.[0] || 'Runeterra',
      gender: champ.gender || champ.sexe || 'Male',
      rangeType: champ.rangeType || (champ.rangetype === 'Melee' ? 'Melee' : 'Ranged'),
      species: champ.species || champ.espece || 'Human',
      releaseYear: champ.releaseYear || champ.annee || '2015'
    };
  };

  // Types de contraintes avec leurs valeurs possibles
  const constraintDefinitions = {
    role: {
      values: ['Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'],
      attribute: 'role'
    },
    lane: {
      values: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
      attribute: 'lane'
    },
    region: {
      values: ['Bandle', 'Bilgewater', 'Demacia', 'Freljord', 'Ionia', 'Ixtal', 'Noxus', 'Piltover', 'Shurima', 'Targon', 'Void', 'Zaun'],
      attribute: 'region'
    },
    gender: {
      values: ['Male', 'Female'],
      attribute: 'gender'
    },
    rangeType: {
      values: ['Melee', 'Ranged'],
      attribute: 'rangeType'
    },
    species: {
      values: ['Human', 'Yordle', 'Vastaya', 'Void', 'Dragon', 'Spirit', 'Darkin', 'Golem', 'Undead'],
      attribute: 'species'
    },
    releaseYear: {
      values: ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      attribute: 'releaseYear'
    }
  };

  // Générer des contraintes logiques basées sur la solution
  const generateLogicalConstraints = React.useCallback((solutionChamps) => {
    if (solutionChamps.length !== 9) return { top: [], left: [] };

    // Récupérer les attributs de tous les champions de la solution
    const champAttributes = solutionChamps.map(c => getChampionAttributes(c));

    // Pour chaque colonne (top), trouver l'attribut commun
    const topConstraints = [];
    for (let col = 0; col < 3; col++) {
      const columnIndices = [col, col + 3, col + 6]; // indices de la colonne
      const columnChamps = columnIndices.map(i => champAttributes[i]);
      
      // Tester chaque type de contrainte pour trouver une valeur commune
      let foundConstraint = null;
      const constraintTypes = Object.keys(constraintDefinitions).sort(() => Math.random() - 0.5);
      
      for (const cType of constraintTypes) {
        const def = constraintDefinitions[cType];
        const values = columnChamps.map(attr => attr[def.attribute]);
        
        // Vérifier si au moins 2 champions ont la même valeur
        const valueCounts = {};
        values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
        const commonValue = Object.entries(valueCounts).find(([val, count]) => count >= 2);
        
        if (commonValue) {
          foundConstraint = {
            type: cType,
            value: commonValue[0],
            label: `${commonValue[0]}`
          };
          break;
        }
      }
      
      // Si aucune contrainte trouvée, prendre une valeur aléatoire
      if (!foundConstraint) {
        const randomType = constraintTypes[0];
        const def = constraintDefinitions[randomType];
        const randomValue = def.values[Math.floor(Math.random() * def.values.length)];
        foundConstraint = {
          type: randomType,
          value: randomValue,
          label: `${randomValue}`
        };
      }
      
      topConstraints.push(foundConstraint);
    }

    // Pour chaque ligne (left), même logique
    const leftConstraints = [];
    for (let row = 0; row < 3; row++) {
      const rowIndices = [row * 3, row * 3 + 1, row * 3 + 2]; // indices de la ligne
      const rowChamps = rowIndices.map(i => champAttributes[i]);
      
      let foundConstraint = null;
      const constraintTypes = Object.keys(constraintDefinitions)
        .filter(t => !topConstraints.some(tc => tc.type === t)) // Éviter les doublons avec top
        .sort(() => Math.random() - 0.5);
      
      for (const cType of constraintTypes) {
        const def = constraintDefinitions[cType];
        const values = rowChamps.map(attr => attr[def.attribute]);
        
        const valueCounts = {};
        values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
        const commonValue = Object.entries(valueCounts).find(([val, count]) => count >= 2);
        
        if (commonValue) {
          foundConstraint = {
            type: cType,
            value: commonValue[0],
            label: `${commonValue[0]}`
          };
          break;
        }
      }
      
      if (!foundConstraint) {
        const randomType = constraintTypes[0] || Object.keys(constraintDefinitions)[0];
        const def = constraintDefinitions[randomType];
        const randomValue = def.values[Math.floor(Math.random() * def.values.length)];
        foundConstraint = {
          type: randomType,
          value: randomValue,
          label: `${randomValue}`
        };
      }
      
      leftConstraints.push(foundConstraint);
    }

    return { top: topConstraints, left: leftConstraints };
  }, []);

  // Reset
  const reset = React.useCallback(() => {
    if (!champions || champions.length < 9) {
      setSolution([]);
      setBoard(Array(9).fill(null));
      setTopConstraints([]);
      setLeftConstraints([]);
      setWon(false);
      setActiveIndex(null);
      setDropdownOpen(false);
      setFeedback(null);
      return;
    }

    const pool = [...champions].sort(() => Math.random() - 0.5);
    const picked = [];
    const seen = new Set();
    for (let i = 0; i < pool.length && picked.length < 9; i++) {
      const id = String(getChampId(pool[i]));
      if (!seen.has(id)) {
        seen.add(id);
        picked.push(pool[i]);
      }
    }
    const finalPicked = picked.length === 9 ? picked : pool.slice(0, 9);

    setSolution(finalPicked);
    setBoard(Array(9).fill(null));
    
    // Générer les contraintes logiques basées sur la solution
    const constraints = generateLogicalConstraints(finalPicked);
    setTopConstraints(constraints.top);
    setLeftConstraints(constraints.left);
    
    setWon(false);
    setActiveIndex(null);
    setDropdownOpen(false);
    setFeedback(null);
    setAnimating(false);
    setSearchFilter('');
  }, [champions, generateLogicalConstraints]);

  React.useEffect(() => {
    reset();
  }, [reset, resetFlag]);

  const placedIds = React.useMemo(() => {
    return new Set(board.filter(Boolean).map(c => String(getChampId(c))));
  }, [board]);

  const placeChampion = (champ) => {
    if (activeIndex === null) return;
    const id = String(getChampId(champ));
    if (placedIds.has(id)) {
      setFeedback({ okIndices: [], badIndices: [activeIndex] });
      setTimeout(() => setFeedback(null), 700);
      return;
    }

    const newBoard = [...board];
    newBoard[activeIndex] = champ;
    setBoard(newBoard);
    setActiveIndex(null);
    setDropdownOpen(false);
    setSearchFilter('');
    setFeedback(null);

    if (newBoard.every(Boolean)) {
      setAnimating(true);
      setTimeout(() => {
        const ok = [];
        const bad = [];
        newBoard.forEach((cell, idx) => {
          const sol = solution[idx];
          if (String(getChampId(cell)) === String(getChampId(sol))) ok.push(idx);
          else bad.push(idx);
        });
        setFeedback({ okIndices: ok, badIndices: bad });
        setAnimating(false);

        if (bad.length === 0) {
          setWon(true);
        }
      }, 700);
    }
  };

  const clearCell = (index) => {
    if (won) return;
    const newBoard = [...board];
    newBoard[index] = null;
    setBoard(newBoard);
    setFeedback(null);
  };

  const champImgUrl = (champ) => {
    const id = getChampId(champ);
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${id}.png`;
  };

  const Legend = () => React.createElement('div', {
    className: 'glass',
    style: { padding: '1rem', marginBottom: '1rem', borderRadius: '12px' }
  },
    React.createElement('h4', null, 'Légende'),
    React.createElement('ul', null,
      React.createElement('li', null, '🎯 Place 9 champions uniques dans la grille (3×3).'),
      React.createElement('li', null, '🎭 Les contraintes en haut indiquent un attribut commun pour TOUTE LA COLONNE.'),
      React.createElement('li', null, '📝 Les contraintes à gauche indiquent un attribut commun pour TOUTE LA LIGNE.'),
      React.createElement('li', null, '🔍 Types de contraintes : Rôle, Lane, Région, Genre, Portée (Mêlée/Distance), Espèce, Année de sortie.'),
      React.createElement('li', null, '✅ Quand la grille est complète, la vérification montre les cases correctes (vert) et incorrectes (rouge).')
    )
  );

  const RulesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return React.createElement('div', {
      style: {
        position: 'fixed', inset: 0, display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999,
        background: 'rgba(0,0,0,0.6)'
      },
      onClick: onClose
    },
      React.createElement('div', {
        className: 'glass',
        style: { padding: '1.5rem', width: 'min(720px, 95%)', borderRadius: '12px' },
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('h3', null, '📜 Règles du Sudoku Champion Logique'),
        React.createElement('p', null, 'Tu dois placer les 9 champions dans la grille. Les contraintes sont logiques et s\'appliquent à toute une ligne ou colonne.'),
        React.createElement('ul', null,
          React.createElement('li', null, '🔼 Contraintes du HAUT : S\'appliquent à toute la COLONNE (les 3 cases verticales).'),
          React.createElement('li', null, '◀️ Contraintes de GAUCHE : S\'appliquent à toute la LIGNE (les 3 cases horizontales).'),
          React.createElement('li', null, '📊 Exemple : Si "Région: Demacia" est en haut de la colonne 1, les 3 champions de cette colonne partagent un lien avec Demacia.'),
          React.createElement('li', null, '🎲 Les contraintes peuvent être : Rôle, Lane, Région, Genre, Portée, Espèce, Année.'),
          React.createElement('li', null, '✅ Complète la grille et découvre si tu as trouvé le bon ordre !')
        ),
        React.createElement('div', { style: { textAlign: 'center', marginTop: '1rem' } },
          React.createElement('button', { className: 'btn btn-primary', onClick: onClose }, 'Compris')
        )
      )
    );
  };

  const VictoryScreen = ({ onReplay, onNext }) => React.createElement('div', {
    className: 'glass',
    style: { padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '2px solid rgba(16,185,129,0.5)', marginTop: '1rem' }
  },
    React.createElement('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, ''),
    React.createElement('h2', { style: { color: '#10b981' } }, 'Bravo !'),
    React.createElement('p', null, 'Tu as résolu le Sudoku avec toutes les contraintes logiques !'),
    React.createElement('div', { style: { marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' } },
      React.createElement('button', { className: 'btn btn-primary', onClick: onReplay }, '🔄 Nouvelle partie'),
      onNext && React.createElement('button', { className: 'btn btn-secondary', onClick: onNext }, '➡️ Mode suivant')
    )
  );

  const SearchDropdown = () => {
    const lower = searchFilter.toLowerCase();
    const list = champions
      .filter(c => {
        const name = (getChampName(c) || '').toLowerCase();
        if (!name) return false;
        if (placedIds.has(String(getChampId(c)))) return false;
        return name.includes(lower);
      })
      .slice(0, 40);

    if (list.length === 0) {
      return React.createElement('div', { style: { padding: '0.6rem', color: '#c8c8c8' } }, 'Aucun champion trouvé');
    }

    return React.createElement('div', { style: { display: 'grid', gap: '6px' } },
      list.map(ch =>
        React.createElement('div', {
          key: getChampId(ch),
          onClick: () => placeChampion(ch),
          style: {
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 8px', cursor: 'pointer', borderRadius: '8px',
            transition: 'background 0.15s'
          },
          onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
          onMouseLeave: e => e.currentTarget.style.background = 'transparent'
        },
          React.createElement('img', {
            src: champImgUrl(ch),
            alt: getChampName(ch),
            style: { width: '36px', height: '36px', borderRadius: '6px' }
          }),
          React.createElement('div', { style: { color: '#fff' } }, getChampName(ch))
        )
      )
    );
  };

  const controlButtons = React.createElement('div', {
    style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }
  },
    React.createElement('button', { className: 'btn btn-secondary', onClick: () => setShowRules(true) }, '📖 RÈGLES'),
    React.createElement('button', { className: 'btn btn-secondary', onClick: () => setShowLegend(!showLegend) }, 'LÉGENDE'),
  );

  // Rendu de la grille avec contraintes
  const renderBoard = React.createElement('div', {
    className: 'glass',
    style: { padding: '1rem', borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }
  },
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '100px repeat(3, 1fr)', gap: '10px' } },
      // Coin supérieur gauche avec indication
      React.createElement('div', { 
        style: { 
          width: '100px', 
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          color: '#888',
          textAlign: 'center',
          padding: '4px'
        } 
      }, '🔼 Colonnes\n◀️ Lignes'),
      
      // Contraintes du haut (3 colonnes)
      ...topConstraints.map((constraint, idx) =>
        React.createElement('div', {
          key: `top-${idx}`,
          style: {
            height: '90px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(147,51,234,0.2), rgba(79,70,229,0.2))',
            border: '2px solid rgba(147,51,234,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            padding: '8px'
          }
        },
          React.createElement('img', {
            src: getConstraintImage(constraint.type, constraint.value),
            alt: constraint.label,
            style: { width: '48px', height: '48px', objectFit: 'contain' },
            onError: (e) => { e.target.style.display = 'none'; }
          }),
          React.createElement('div', { 
            style: { 
              fontSize: '0.7rem', 
              color: '#c4b5fd', 
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: '1.2'
            } 
          }, constraint.label)
        )
      ),

      // Lignes de la grille (3 lignes)
      ...[0, 1, 2].flatMap(row => [
        // Contrainte de gauche
        React.createElement('div', {
          key: `left-${row}`,
          style: {
            width: '100px',
            height: '110px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(219,39,119,0.2))',
            border: '2px solid rgba(236,72,153,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            padding: '8px'
          }
        },
          React.createElement('img', {
            src: getConstraintImage(leftConstraints[row]?.type, leftConstraints[row]?.value),
            alt: leftConstraints[row]?.label || '',
            style: { width: '48px', height: '48px', objectFit: 'contain' },
            onError: (e) => { e.target.style.display = 'none'; }
          }),
          React.createElement('div', { 
            style: { 
              fontSize: '0.7rem', 
              color: '#fbcfe8', 
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: '1.2'
            } 
          }, leftConstraints[row]?.label || '')
        ),
        
        // Cellules de la grille (3 par ligne)
        ...[0, 1, 2].map(col => {
          const idx = row * 3 + col;
          const cell = board[idx];
          const isActive = activeIndex === idx;
          const ok = feedback && feedback.okIndices && feedback.okIndices.includes(idx);
          const bad = feedback && feedback.badIndices && feedback.badIndices.includes(idx);
          const highlightStyle = ok ? { boxShadow: '0 0 18px rgba(16,185,129,0.25)', border: '2px solid rgba(16,185,129,0.9)' }
            : bad ? { boxShadow: '0 0 18px rgba(239,68,68,0.18)', border: '2px solid rgba(239,68,68,0.9)' }
            : {};

          return React.createElement('div', {
            key: idx,
            onClick: () => {
              if (won || animating) return;
              setActiveIndex(idx);
              setDropdownOpen(true);
              setFeedback(null);
            },
            style: Object.assign({
              height: '110px',
              borderRadius: '10px',
              background: '#0f0f12',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: won ? 'default' : 'pointer',
              position: 'relative',
              transition: 'transform 0.12s, box-shadow 0.2s'
            }, isActive ? { transform: 'scale(1.03)', border: '2px solid #ffcc00' } : { border: '1px solid rgba(255,255,255,0.06)' }, highlightStyle)
          },
            cell ? React.createElement('img', {
              src: champImgUrl(cell),
              alt: getChampName(cell),
              style: { width: '72px', height: '72px', borderRadius: '8px' }
            }) : React.createElement('div', { style: { fontSize: '2.2rem', color: '#5a5a5a' } }, '+'),
            
            cell && !won && React.createElement('button', {
              onClick: (e) => { e.stopPropagation(); clearCell(idx); },
              style: {
                position: 'absolute',
                right: '6px',
                top: '6px',
                padding: '4px 6px',
                borderRadius: '6px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }
            }, '✕')
          );
        })
      ])
    ),

    // Dropdown sous la grille
    activeIndex !== null && dropdownOpen && React.createElement('div', {
      style: { marginTop: '12px', maxHeight: '260px', overflowY: 'auto', borderRadius: '10px', padding: '0.5rem', background: 'rgba(10,10,12,0.7)' }
    },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Rechercher un champion...',
        value: searchFilter,
        onChange: (e) => setSearchFilter(e.target.value),
        autoFocus: true,
        style: {
          width: '100%',
          padding: '0.6rem',
          borderRadius: '8px',
          marginBottom: '8px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(20,20,20,0.6)',
          color: '#fff',
          outline: 'none'
        }
      }),
      React.createElement(SearchDropdown, null)
    )
  );

  const winScreen = won && React.createElement(VictoryScreen, {
    onReplay: reset,
    onNext: () => onNextMode && onNextMode('CLASSIQUE')
  });

  return React.createElement('div', null,
    controlButtons,
    showLegend && React.createElement(Legend, null),
    renderBoard,
    winScreen,
    React.createElement(RulesModal, { isOpen: showRules, onClose: () => setShowRules(false) })
  );
}