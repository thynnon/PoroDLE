// items.js - Mode Items avec 3 sous-modes innovants

// Modal des règles
function ItemsRulesModal({ isOpen, onClose, gameMode }) {
  const getModeDescription = () => {
    switch(gameMode) {
      case 'pixelated':
        return 'Devine l\'item à partir d\'une image pixelisée ! L\'image devient plus nette à chaque erreur.';
      case 'emoji':
        return 'Devine l\'item à partir d\'emojis ! Déchiffre les indices émojis pour trouver l\'item.';
      case 'reverse':
        return 'On te donne le prix et les stats, trouve l\'item ! Mode expert inversé.';
      default:
        return 'Choisis ton mode de jeu !';
    }
  };

  return React.createElement(Modal, { isOpen, onClose, title: '📖 Règles du Mode Items' },
    React.createElement('p', { style: { marginBottom: '1.5rem' } }, getModeDescription()),
    
    gameMode === 'pixelated' && React.createElement('div', null,
      React.createElement('h3', null, '🎯 Mode : Item Pixelisé'),
      React.createElement('ul', null,
        React.createElement('li', null, '🖼️ Un item est affiché en version TRÈS pixelisée (8x8px)'),
        React.createElement('li', null, '🔍 À chaque mauvaise réponse, l\'image devient plus nette (+8px)'),
        React.createElement('li', null, '📊 Moins tu fais de tentatives, plus tu gagnes de points'),
        React.createElement('li', null, '🎮 6 tentatives max par item, 10 items au total')
      ),
      React.createElement('h3', null, '🏆 Système de points'),
      React.createElement('ul', null,
        React.createElement('li', null, '🎯 1ère tentative : 100 points'),
        React.createElement('li', null, '✅ 2ème tentative : 80 points'),
        React.createElement('li', null, '👍 3ème tentative : 60 points'),
        React.createElement('li', null, '😐 4ème tentative : 40 points'),
        React.createElement('li', null, '😬 5ème tentative : 20 points'),
        React.createElement('li', null, '❌ 6ème tentative : 10 points')
      )
    ),

    gameMode === 'emoji' && React.createElement('div', null,
      React.createElement('h3', null, '😎 Mode : Emojis Mystères'),
      React.createElement('ul', null,
        React.createElement('li', null, '🎭 Des emojis représentent l\'item'),
        React.createElement('li', null, '🤔 Déchiffre les indices pour deviner'),
        React.createElement('li', null, '💡 Chaque emoji a une signification !'),
        React.createElement('li', null, '🎯 3 chances par item, 10 items au total')
      ),
      React.createElement('h3', null, '❤️ Système de vies'),
      React.createElement('ul', null,
        React.createElement('li', null, '💚 Tu commences avec 3 vies'),
        React.createElement('li', null, '✅ Bonne réponse du premier coup : +10 pts'),
        React.createElement('li', null, '👍 Bonne réponse (2-3 essais) : +5 pts'),
        React.createElement('li', null, '❌ Échec après 3 essais : -1 vie'),
        React.createElement('li', null, '💀 0 vie : Game Over')
      )
    ),

    gameMode === 'reverse' && React.createElement('div', null,
      React.createElement('h3', null, '🔄 Mode : Devinette Inversée'),
      React.createElement('ul', null,
        React.createElement('li', null, '💰 Le prix de l\'item est affiché'),
        React.createElement('li', null, '📊 Les statistiques sont montrées'),
        React.createElement('li', null, '🎯 Trouve quel item correspond !'),
        React.createElement('li', null, '🔥 Mode expert : 1 chance par item')
      ),
      React.createElement('h3', null, '💯 Scoring'),
      React.createElement('ul', null,
        React.createElement('li', null, '✅ Bonne réponse : +10 points'),
        React.createElement('li', null, '❌ Mauvaise réponse : 0 point'),
        React.createElement('li', null, '🏆 10 items à deviner, score max : 100')
      )
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
      '🛡️ Es-tu un expert des items de LoL ? 🎮'
    )
  );
}

function ItemsMode({ champions, version, resetFlag, setShowSettings, onNextMode, currentMode }) {
  const [items, setItems] = React.useState([]);
  const [gameMode, setGameMode] = React.useState(null);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [round, setRound] = React.useState(1);
  const [gameOver, setGameOver] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showRules, setShowRules] = React.useState(false);
  const [guesses, setGuesses] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  // États pour Pixelated
  const [pixelLevel, setPixelLevel] = React.useState(8);
  const [attempts, setAttempts] = React.useState(0);
  
  // États pour Emoji
  const [lives, setLives] = React.useState(3);
  const [emojiAttempts, setEmojiAttempts] = React.useState(0);
  const [usedItems, setUsedItems] = React.useState([]);

  const MAX_ROUNDS = 10;
  const MAX_PIXEL_ATTEMPTS = 6;
  const MAX_EMOJI_ATTEMPTS = 3;

  // Charger les items
  React.useEffect(() => {
    loadItems();
  }, [version, resetFlag]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`);
      const data = await response.json();
      
      const srItemIds = [
        '1001', '1004', '1006', '1011', '1018', '1026', '1027', '1028', '1029', '1031', 
        '1033', '1036', '1037', '1038', '1042', '1043', '1052', '1053', '1054', '1055', 
        '1056', '1057', '1058', '1082', '1083',
        '3006', '3009', '3020', '3047', '3111', '3117', '3158',
        '3003', '3004', '3011', '3026', '3031', '3033', '3035', '3036', '3040', '3042',
        '3046', '3050', '3053', '3065', '3067', '3068', '3071', '3072', '3074', '3075',
        '3078', '3084', '3085', '3087', '3089', '3091', '3094', '3095', '3100', '3102',
        '3107', '3109', '3110', '3115', '3116', '3119', '3121', '3123', '3124', '3135',
        '3139', '3142', '3143', '3145', '3152', '3153', '3156', '3157', '3161', '3165',
        '3172', '3181', '3184', '3190', '3193', '3222', '3504', '4005', '4628', '4629',
        '4630', '4632', '4633', '4636', '4637', '4638', '6029', '6035', '6333', '6609',
        '6610', '6616', '6617', '6620', '6621', '6630', '6631', '6632', '6653', '6655',
        '6656', '6657', '6662', '6664', '6665', '6667', '6671', '6672', '6673', '6675',
        '6676', '6677', '6691', '6692', '6693', '6694', '6695', '6696', '6697', '6698',
        '7000', '7001', '7002', '7005', '7006', '7009', '7010', '7011', '7012', '7013',
        '7014', '7015', '7016', '7017', '7018', '7019', '7020', '7021', '7023'
      ];
      
      const parsedItems = Object.entries(data.data)
        .filter(([id]) => srItemIds.includes(id))
        .map(([id, item]) => ({
          id,
          name: item.name,
          icon: item.image.full,
          price: item.gold?.total || 0,
          description: item.plaintext || '',
          stats: item.stats || {},
          tags: item.tags || []
        }))
        .filter(item => 
          item.price > 0 &&
          !item.name.includes('Suppression') &&
          !item.name.includes('Removed')
        );

      setItems(parsedItems);
      if (parsedItems.length > 0) {
        setCurrentItem(parsedItems[Math.floor(Math.random() * parsedItems.length)]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  // Générer des emojis basés sur l'item
  const generateEmojis = (item) => {
    const name = item.name.toLowerCase();
    const tags = item.tags.map(t => t.toLowerCase());
    
    let emojis = [];
    
    // Tags
    if (tags.includes('damage')) emojis.push('⚔️');
    if (tags.includes('criticalstrike')) emojis.push('🎯');
    if (tags.includes('attackspeed')) emojis.push('⚡');
    if (tags.includes('lifesteal')) emojis.push('🩸');
    if (tags.includes('armor')) emojis.push('🛡️');
    if (tags.includes('magicresist')) emojis.push('✨');
    if (tags.includes('health')) emojis.push('❤️');
    if (tags.includes('healthregen')) emojis.push('💚');
    if (tags.includes('mana')) emojis.push('💙');
    if (tags.includes('manaregen')) emojis.push('💧');
    if (tags.includes('spelldamage')) emojis.push('🔮');
    if (tags.includes('boots')) emojis.push('👢');
    
    // Noms spécifiques
    if (name.includes('infini')) emojis.push('♾️');
    if (name.includes('trinity') || name.includes('trinité')) emojis.push('🔱');
    if (name.includes('death') || name.includes('mort')) emojis.push('💀');
    if (name.includes('guardian') || name.includes('gardien')) emojis.push('👼');
    if (name.includes('bloodthirster') || name.includes('soif')) emojis.push('🧛');
    if (name.includes('rabadon')) emojis.push('🎩');
    if (name.includes('thornmail') || name.includes('ronce')) emojis.push('🌹');
    if (name.includes('void') || name.includes('néant')) emojis.push('🕳️');
    if (name.includes('phantom') || name.includes('danseur')) emojis.push('👻');
    if (name.includes('black') || name.includes('noir')) emojis.push('⚫');
    
    // Prix
    if (item.price > 3000) emojis.push('💎');
    else if (item.price > 2000) emojis.push('💰');
    else if (item.price < 1000) emojis.push('🪙');
    
    return emojis.length > 0 ? emojis.slice(0, 4) : ['❓', '🎮', '🛡️'];
  };

  // Gérer les tentatives Pixelated
  const handlePixelatedGuess = (item) => {
    if (!currentItem || showResult) return;
    if (guesses.some(g => g.id === item.id)) return;

    const isCorrect = item.id === currentItem.id;
    setGuesses([...guesses, item]);
    setAttempts(attempts + 1);
    setSearchInput('');
    setShowDropdown(false);

    if (isCorrect) {
      const points = [100, 80, 60, 40, 20, 10][attempts] || 10;
      setScore(score + points);
      setShowResult(true);

      setTimeout(() => {
        if (round < MAX_ROUNDS) {
          setRound(round + 1);
          const availableItems = items.filter(i => !usedItems.includes(i.id));
          const nextItem = availableItems[Math.floor(Math.random() * availableItems.length)];
          setCurrentItem(nextItem);
          setUsedItems([...usedItems, nextItem.id]);
          setGuesses([]);
          setAttempts(0);
          setPixelLevel(8);
          setShowResult(false);
        } else {
          setGameOver(true);
        }
      }, 2000);
    } else {
      if (attempts + 1 >= MAX_PIXEL_ATTEMPTS) {
        setShowResult(true);
        setTimeout(() => {
          if (round < MAX_ROUNDS) {
            setRound(round + 1);
            const availableItems = items.filter(i => !usedItems.includes(i.id));
            const nextItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            setCurrentItem(nextItem);
            setUsedItems([...usedItems, nextItem.id]);
            setGuesses([]);
            setAttempts(0);
            setPixelLevel(8);
            setShowResult(false);
          } else {
            setGameOver(true);
          }
        }, 2000);
      } else {
        setPixelLevel(Math.min(64, pixelLevel + 8));
      }
    }
  };

  // Gérer les tentatives Emoji
  const handleEmojiGuess = (item) => {
    if (!currentItem || lives <= 0) return;
    if (guesses.some(g => g.id === item.id)) return;

    const isCorrect = item.id === currentItem.id;
    setGuesses([...guesses, item]);
    setEmojiAttempts(emojiAttempts + 1);
    setSearchInput('');
    setShowDropdown(false);

    if (isCorrect) {
      const points = emojiAttempts === 0 ? 10 : 5;
      setScore(score + points);
      setShowResult(true);

      setTimeout(() => {
        if (round < MAX_ROUNDS) {
          setRound(round + 1);
          const availableItems = items.filter(i => !usedItems.includes(i.id));
          const nextItem = availableItems[Math.floor(Math.random() * availableItems.length)];
          setCurrentItem(nextItem);
          setUsedItems([...usedItems, nextItem.id]);
          setGuesses([]);
          setEmojiAttempts(0);
          setShowResult(false);
        } else {
          setGameOver(true);
        }
      }, 2000);
    } else {
      if (emojiAttempts + 1 >= MAX_EMOJI_ATTEMPTS) {
        setLives(lives - 1);
        setShowResult(true);
        
        setTimeout(() => {
          if (lives - 1 <= 0) {
            setGameOver(true);
          } else if (round < MAX_ROUNDS) {
            setRound(round + 1);
            const availableItems = items.filter(i => !usedItems.includes(i.id));
            const nextItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            setCurrentItem(nextItem);
            setUsedItems([...usedItems, nextItem.id]);
            setGuesses([]);
            setEmojiAttempts(0);
            setShowResult(false);
          } else {
            setGameOver(true);
          }
        }, 2000);
      }
    }
  };

  // Gérer les tentatives Reverse
  const handleReverseGuess = (item) => {
    if (!currentItem || showResult) return;

    const isCorrect = item.id === currentItem.id;
    setSearchInput('');
    setShowDropdown(false);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(() => {
      if (round < MAX_ROUNDS) {
        setRound(round + 1);
        const availableItems = items.filter(i => !usedItems.includes(i.id));
        const nextItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        setCurrentItem(nextItem);
        setUsedItems([...usedItems, nextItem.id]);
        setShowResult(false);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  // Reset
  const resetGame = () => {
    setRound(1);
    setScore(0);
    setGameOver(false);
    setGuesses([]);
    setAttempts(0);
    setEmojiAttempts(0);
    setLives(3);
    setPixelLevel(8);
    setShowResult(false);
    setUsedItems([]);
    setCurrentItem(items[Math.floor(Math.random() * items.length)]);
  };

  const backToMenu = () => {
    setGameMode(null);
    resetGame();
  };

  const getPixelRank = () => {
    if (score >= 800) return { emoji: '🏆', text: 'Expert', color: '#ffd700' };
    if (score >= 600) return { emoji: '⭐', text: 'Très bon', color: '#c0c0c0' };
    if (score >= 400) return { emoji: '👍', text: 'Bon', color: '#cd7f32' };
    return { emoji: '😅', text: 'Peut mieux faire', color: '#8b4513' };
  };

  if (loading) {
    return React.createElement('div', {
      style: {
        minHeight: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }
    },
      React.createElement('div', { style: { fontSize: '4rem' } }, '⏳'),
      React.createElement('div', { 
        style: { fontSize: '1.5rem', color: '#c8aa6e', fontWeight: 600 } 
      }, 'Chargement des items...')
    );
  }

  // Menu de sélection
  if (!gameMode) {
    return React.createElement('div', null,
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }
      },
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: () => setShowRules(true)
        }, '📖 RÈGLES')
      ),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem'
        }
      },
        // Mode Pixelated
        React.createElement('div', {
          onClick: () => setGameMode('pixelated'),
          style: {
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(167,139,250,0.1))',
            border: '2px solid rgba(139,92,246,0.4)',
            borderRadius: '16px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          },
          onMouseEnter: e => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(139,92,246,0.3)';
          },
          onMouseLeave: e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        },
          React.createElement('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '🖼️'),
          React.createElement('h3', { 
            style: { 
              fontSize: '1.5rem', 
              color: '#8b5cf6', 
              marginBottom: '0.5rem',
              fontWeight: 700
            } 
          }, 'Item Pixelisé'),
          React.createElement('p', { 
            style: { 
              color: 'rgba(240,230,210,0.8)',
              lineHeight: 1.6
            } 
          }, 'Devine l\'item à partir d\'une image pixelisée. L\'image devient plus nette à chaque erreur !')
        ),

        // Mode Emoji
        React.createElement('div', {
          onClick: () => setGameMode('emoji'),
          style: {
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.1))',
            border: '2px solid rgba(245,158,11,0.4)',
            borderRadius: '16px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          },
          onMouseEnter: e => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(245,158,11,0.3)';
          },
          onMouseLeave: e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        },
          React.createElement('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '😎'),
          React.createElement('h3', { 
            style: { 
              fontSize: '1.5rem', 
              color: '#f59e0b', 
              marginBottom: '0.5rem',
              fontWeight: 700
            } 
          }, 'Emojis Mystères'),
          React.createElement('p', { 
            style: { 
              color: 'rgba(240,230,210,0.8)',
              lineHeight: 1.6
            } 
          }, 'Déchiffre les emojis pour deviner l\'item ! 3 essais max avec système de vies.')
        ),

        // Mode Reverse
        React.createElement('div', {
          onClick: () => setGameMode('reverse'),
          style: {
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.1))',
            border: '2px solid rgba(16,185,129,0.4)',
            borderRadius: '16px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          },
          onMouseEnter: e => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(16,185,129,0.3)';
          },
          onMouseLeave: e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        },
          React.createElement('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '🔄'),
          React.createElement('h3', { 
            style: { 
              fontSize: '1.5rem', 
              color: '#10b981', 
              marginBottom: '0.5rem',
              fontWeight: 700
            } 
          }, 'Devinette Inversée'),
          React.createElement('p', { 
            style: { 
              color: 'rgba(240,230,210,0.8)',
              lineHeight: 1.6
            } 
          }, 'On te donne le prix et les stats, trouve l\'item ! Mode expert en 1 chance.')
        )
      ),

      React.createElement(ItemsRulesModal, { 
        isOpen: showRules, 
        onClose: () => setShowRules(false),
        gameMode: null
      })
    );
  }

  // Écrans de fin
  if (gameOver) {
    const rank = getPixelRank();
    
    return React.createElement('div', null,
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }
      },
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: backToMenu
        }, '◀️ MENU')
      ),

      React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '2px solid rgba(245,158,11,0.5)'
        }
      },
        React.createElement('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, rank.emoji),
        React.createElement('h2', { 
          style: { 
            fontSize: '2.5rem', 
            color: rank.color, 
            marginBottom: '1rem',
            fontWeight: 800
          } 
        }, gameMode === 'emoji' && lives <= 0 ? 'Game Over !' : 'Partie terminée !'),
        React.createElement('div', {
          style: {
            fontSize: '3rem',
            fontWeight: 800,
            color: '#f59e0b',
            marginBottom: '0.5rem'
          }
        }, `${score} points`),
        React.createElement('p', { 
          style: { 
            fontSize: '1.5rem', 
            color: rank.color, 
            marginBottom: '2rem',
            fontWeight: 700
          } 
        }, rank.text),
        React.createElement('div', {
          style: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }
        },
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: resetGame,
            style: { padding: '1rem 2.5rem', fontSize: '1.2rem' }
          }, '🔄 REJOUER'),
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: () => {
              const modes = ['CLASSIQUE', 'CITATIONS', 'SPELLS', 'SPLASHART', 'ITEMS', 'SUDOKU'];
              const currentIndex = modes.indexOf(currentMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              onNextMode && onNextMode(modes[nextIndex]);
            },
            style: {
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #c8aa6e, #a88c5a)',
              color: '#0a0e12',
              border: 'none'
            }
          }, '➡️ JEU SUIVANT')
        )
      )
    );
  }

  // Dropdown de recherche
  const filteredItems = items.filter(item => 
    !guesses.some(g => g.id === item.id) &&
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  ).slice(0, 15);

  // Interface Mode Pixelated
  if (gameMode === 'pixelated') {
    return React.createElement('div', null,
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }
      },
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: backToMenu
        }, '◀️ MENU'),
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: () => setShowRules(true)
        }, '📖 RÈGLES')
      ),
      
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(15,15,20,0.6)',
          borderRadius: '10px',
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }
      },
        React.createElement('div', { style: { color: '#c8aa6e', fontSize: '1.2rem' } }, `Round ${round}/${MAX_ROUNDS}`),
        React.createElement('div', { style: { color: '#8b5cf6', fontSize: '1.2rem' } }, `Tentatives: ${attempts}/${MAX_PIXEL_ATTEMPTS}`),
        React.createElement('div', { style: { color: '#f59e0b', fontSize: '1.4rem', fontWeight: 700 } }, `Score: ${score}`)
      ),

      currentItem && React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '800px',
          margin: '0 auto 2rem',
          padding: '2rem',
          borderRadius: '16px',
          border: '2px solid rgba(139,92,246,0.4)',
          textAlign: 'center'
        }
      },
        React.createElement('div', {
          style: {
            position: 'relative',
            width: '200px',
            height: '200px',
            margin: '0 auto 2rem',
            overflow: 'hidden',
            borderRadius: '12px',
            border: '2px solid rgba(139,92,246,0.4)'
          }
        },
          React.createElement('img', {
            src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${currentItem.icon}`,
            alt: '?',
            style: {
              width: `${pixelLevel}px`,
              height: `${pixelLevel}px`,
              imageRendering: 'pixelated',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(' + (200 / pixelLevel) + ')',
              transformOrigin: 'center'
            }
          })
        ),
        
        showResult && React.createElement('div', {
          style: {
            fontSize: '1.8rem',
            color: guesses[guesses.length - 1]?.id === currentItem.id ? '#10b981' : '#ef4444',
            fontWeight: 700,
            marginBottom: '1rem'
          }
        }, guesses[guesses.length - 1]?.id === currentItem.id ? `✅ Bravo ! C'était ${currentItem.name}` : `❌ Raté ! C'était ${currentItem.name}`)
      ),

      !showResult && React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '16px',
          border: '2px solid rgba(139,92,246,0.4)'
        }
      },
        React.createElement('h3', {
          style: {
            fontSize: '1.3rem',
            color: '#8b5cf6',
            marginBottom: '1rem',
            textAlign: 'center'
          }
        }, '🔍 Devine l\'item'),
        
        React.createElement('div', { style: { position: 'relative', marginBottom: '1.5rem' } },
          React.createElement('input', {
            type: 'text',
            value: searchInput,
            onChange: e => setSearchInput(e.target.value),
            onFocus: () => setShowDropdown(true),
            onBlur: () => setTimeout(() => setShowDropdown(false), 200),
            placeholder: 'Rechercher un item...',
            style: {
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: '2px solid rgba(139,92,246,0.3)',
              background: 'rgba(10,10,12,0.6)',
              color: '#fff',
              outline: 'none'
            }
          }),
          
          showDropdown && searchInput && React.createElement('div', {
            style: {
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '300px',
              overflowY: 'auto',
              background: '#1a1f2e',
              border: '2px solid rgba(139,92,246,0.3)',
              borderRadius: '10px',
              marginTop: '0.5rem',
              zIndex: 100
            }
          },
            filteredItems.map(item =>
              React.createElement('div', {
                key: item.id,
                onClick: () => handlePixelatedGuess(item),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(139,92,246,0.1)'
                },
                onMouseEnter: e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)',
                onMouseLeave: e => e.currentTarget.style.background = 'transparent'
              },
                React.createElement('img', {
                  src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.icon}`,
                  alt: item.name,
                  style: { width: '48px', height: '48px' }
                }),
                React.createElement('div', {
                  style: { color: '#f0e6d2', fontWeight: 600 }
                }, item.name)
              )
            )
          )
        ),
        
        guesses.length > 0 && React.createElement('div', {
          style: {
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.3)'
          }
        },
          React.createElement('div', {
            style: { color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }
          }, '❌ Mauvaises réponses:'),
          React.createElement('div', {
            style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }
          },
            guesses.map(g =>
              React.createElement('span', {
                key: g.id,
                style: {
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(239,68,68,0.2)',
                  borderRadius: '6px',
                  color: '#f0e6d2',
                  fontSize: '0.875rem'
                }
              }, g.name)
            )
          )
        )
      ),

      React.createElement(ItemsRulesModal, { 
        isOpen: showRules, 
        onClose: () => setShowRules(false),
        gameMode: 'pixelated'
      })
    );
  }

  // Interface Mode Emoji
  if (gameMode === 'emoji') {
    const emojis = currentItem ? generateEmojis(currentItem) : [];
    
    return React.createElement('div', null,
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }
      },
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: backToMenu
        }, '◀️ MENU'),
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: () => setShowRules(true)
        }, '📖 RÈGLES')
      ),
      
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(15,15,20,0.6)',
          borderRadius: '10px',
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }
      },
        React.createElement('div', { style: { color: '#c8aa6e', fontSize: '1.2rem' } }, `Round ${round}/${MAX_ROUNDS}`),
        React.createElement('div', { style: { display: 'flex', gap: '0.5rem', fontSize: '1.5rem' } },
          Array.from({ length: 3 }).map((_, i) => 
            React.createElement('span', { key: i }, i < lives ? '💚' : '🖤')
          )
        ),
        React.createElement('div', { style: { color: '#f59e0b', fontSize: '1.4rem', fontWeight: 700 } }, `Score: ${score}`)
      ),

      currentItem && React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '800px',
          margin: '0 auto 2rem',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '2px solid rgba(245,158,11,0.4)',
          textAlign: 'center'
        }
      },
        React.createElement('h3', {
          style: {
            fontSize: '1.5rem',
            color: '#f59e0b',
            marginBottom: '2rem'
          }
        }, '🤔 Déchiffre les emojis'),
        
        React.createElement('div', {
          style: {
            fontSize: '5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem'
          }
        }, ...emojis.map((emoji, i) => React.createElement('span', { key: i }, emoji))),
        
        React.createElement('div', {
          style: {
            fontSize: '1.2rem',
            color: '#c8aa6e',
            marginBottom: '2rem'
          }
        }, `Tentatives: ${emojiAttempts}/${MAX_EMOJI_ATTEMPTS}`),
        
        showResult && React.createElement('div', {
          style: {
            fontSize: '1.8rem',
            color: guesses[guesses.length - 1]?.id === currentItem.id ? '#10b981' : '#ef4444',
            fontWeight: 700,
            marginBottom: '1rem'
          }
        }, guesses[guesses.length - 1]?.id === currentItem.id ? `✅ Bravo ! C'était ${currentItem.name}` : `❌ Raté ! C'était ${currentItem.name}`)
      ),

      !showResult && React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '16px',
          border: '2px solid rgba(245,158,11,0.4)'
        }
      },
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement('input', {
            type: 'text',
            value: searchInput,
            onChange: e => setSearchInput(e.target.value),
            onFocus: () => setShowDropdown(true),
            onBlur: () => setTimeout(() => setShowDropdown(false), 200),
            placeholder: 'Rechercher un item...',
            style: {
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: '2px solid rgba(245,158,11,0.3)',
              background: 'rgba(10,10,12,0.6)',
              color: '#fff',
              outline: 'none'
            }
          }),
          
          showDropdown && searchInput && React.createElement('div', {
            style: {
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '300px',
              overflowY: 'auto',
              background: '#1a1f2e',
              border: '2px solid rgba(245,158,11,0.3)',
              borderRadius: '10px',
              marginTop: '0.5rem',
              zIndex: 100
            }
          },
            filteredItems.map(item =>
              React.createElement('div', {
                key: item.id,
                onClick: () => handleEmojiGuess(item),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(245,158,11,0.1)'
                },
                onMouseEnter: e => e.currentTarget.style.background = 'rgba(245,158,11,0.15)',
                onMouseLeave: e => e.currentTarget.style.background = 'transparent'
              },
                React.createElement('img', {
                  src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.icon}`,
                  alt: item.name,
                  style: { width: '48px', height: '48px' }
                }),
                React.createElement('div', {
                  style: { color: '#f0e6d2', fontWeight: 600 }
                }, item.name)
              )
            )
          )
        ),
        
        guesses.length > 0 && React.createElement('div', {
          style: {
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.3)'
          }
        },
          React.createElement('div', {
            style: { color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }
          }, '❌ Essais:'),
          React.createElement('div', {
            style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }
          },
            guesses.map(g =>
              React.createElement('span', {
                key: g.id,
                style: {
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(239,68,68,0.2)',
                  borderRadius: '6px',
                  color: '#f0e6d2',
                  fontSize: '0.875rem'
                }
              }, g.name)
            )
          )
        )
      ),

      React.createElement(ItemsRulesModal, { 
        isOpen: showRules, 
        onClose: () => setShowRules(false),
        gameMode: 'emoji'
      })
    );
  }

  // Interface Mode Reverse
  if (gameMode === 'reverse') {
    const stats = currentItem ? Object.entries(currentItem.stats) : [];
    
    return React.createElement('div', null,
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }
      },
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: backToMenu
        }, '◀️ MENU'),
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: () => setShowRules(true)
        }, '📖 RÈGLES')
      ),
      
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(15,15,20,0.6)',
          borderRadius: '10px',
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }
      },
        React.createElement('div', { style: { color: '#c8aa6e', fontSize: '1.2rem' } }, `Round ${round}/${MAX_ROUNDS}`),
        React.createElement('div', { style: { color: '#f59e0b', fontSize: '1.4rem', fontWeight: 700 } }, `Score: ${score}`)
      ),

      currentItem && React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '800px',
          margin: '0 auto 2rem',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '2px solid rgba(16,185,129,0.4)',
          textAlign: 'center'
        }
      },
        React.createElement('h3', {
          style: {
            fontSize: '1.5rem',
            color: '#10b981',
            marginBottom: '2rem'
          }
        }, '🔄 Trouve l\'item !'),
        
        React.createElement('div', {
          style: {
            fontSize: '3rem',
            color: '#f59e0b',
            fontWeight: 800,
            marginBottom: '2rem'
          }
        }, `💰 ${currentItem.price} or`),
        
        stats.length > 0 && React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }
        },
          stats.map(([key, value]) =>
            React.createElement('div', {
              key,
              style: {
                padding: '1rem',
                background: 'rgba(16,185,129,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16,185,129,0.3)'
              }
            },
              React.createElement('div', {
                style: { color: '#c8aa6e', fontSize: '0.875rem', marginBottom: '0.25rem' }
              }, key),
              React.createElement('div', {
                style: { color: '#10b981', fontSize: '1.2rem', fontWeight: 700 }
              }, `+${value}`)
            )
          )
        ),
        
        currentItem.tags.length > 0 && React.createElement('div', {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '2rem'
          }
        },
          currentItem.tags.map(tag =>
            React.createElement('span', {
              key: tag,
              style: {
                padding: '0.5rem 1rem',
                background: 'rgba(16,185,129,0.2)',
                borderRadius: '6px',
                color: '#10b981',
                fontSize: '0.875rem',
                fontWeight: 600
              }
            }, tag)
          )
        ),
        
        showResult && React.createElement('div', {
          style: {
            fontSize: '1.8rem',
            color: '#10b981',
            fontWeight: 700,
            marginTop: '1rem'
          }
        }, `✅ C'était ${currentItem.name} !`)
      ),

      !showResult && React.createElement('div', {
        className: 'glass',
        style: {
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          borderRadius: '16px',
          border: '2px solid rgba(16,185,129,0.4)'
        }
      },
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement('input', {
            type: 'text',
            value: searchInput,
            onChange: e => setSearchInput(e.target.value),
            onFocus: () => setShowDropdown(true),
            onBlur: () => setTimeout(() => setShowDropdown(false), 200),
            placeholder: 'Rechercher un item...',
            style: {
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: '2px solid rgba(16,185,129,0.3)',
              background: 'rgba(10,10,12,0.6)',
              color: '#fff',
              outline: 'none'
            }
          }),
          
          showDropdown && searchInput && React.createElement('div', {
            style: {
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '300px',
              overflowY: 'auto',
              background: '#1a1f2e',
              border: '2px solid rgba(16,185,129,0.3)',
              borderRadius: '10px',
              marginTop: '0.5rem',
              zIndex: 100
            }
          },
            filteredItems.map(item =>
              React.createElement('div', {
                key: item.id,
                onClick: () => handleReverseGuess(item),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(16,185,129,0.1)'
                },
                onMouseEnter: e => e.currentTarget.style.background = 'rgba(16,185,129,0.15)',
                onMouseLeave: e => e.currentTarget.style.background = 'transparent'
              },
                React.createElement('img', {
                  src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.icon}`,
                  alt: item.name,
                  style: { width: '48px', height: '48px' }
                }),
                React.createElement('div', {
                  style: { color: '#f0e6d2', fontWeight: 600 }
                }, item.name)
              )
            )
          )
        )
      ),

      React.createElement(ItemsRulesModal, { 
        isOpen: showRules, 
        onClose: () => setShowRules(false),
        gameMode: 'reverse'
      })
    );
  }

  return null;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ItemsMode;
}