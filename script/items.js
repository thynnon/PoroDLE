// ========================================
// JEU : DEVINE LE PRIX
// ========================================
function PriceGuessGame() {
  const [items, setItems] = React.useState([]);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [userGuess, setUserGuess] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [round, setRound] = React.useState(1);
  const [gameOver, setGameOver] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const MAX_ROUNDS = 10;
  const version = '15.1.1';

  // Charger les items au démarrage
  React.useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`)
      .then(res => res.json())
      .then(data => {
        const parsed = Object.entries(data.data)
          .map(([id, it]) => ({
            id,
            name: it.name,
            icon: it.image.full,
            price: it.gold?.total ?? 0
          }))
          .filter(it =>
            !it.name.includes("Suppression") &&
            !it.name.includes("Removed") &&
            it.gold?.total > 500
          );

        setItems(parsed);
        setCurrentItem(parsed[Math.floor(Math.random() * parsed.length)]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = () => {
    if (!userGuess || showResult) return;

    const guess = parseInt(userGuess);
    const actualPrice = currentItem.price;
    const difference = Math.abs(guess - actualPrice);
    
    let points = 0;
    if (difference === 0) points = 100;
    else if (difference <= 100) points = 80;
    else if (difference <= 300) points = 60;
    else if (difference <= 500) points = 40;
    else if (difference <= 800) points = 20;
    else points = 10;

    setScore(prev => prev + points);
    setShowResult(true);

    setTimeout(() => {
      if (round < MAX_ROUNDS) {
        setRound(prev => prev + 1);
        setCurrentItem(items[Math.floor(Math.random() * items.length)]);
        setUserGuess('');
        setShowResult(false);
      } else {
        setGameOver(true);
      }
    }, 2500);
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setGameOver(false);
    setUserGuess('');
    setShowResult(false);
    setCurrentItem(items[Math.floor(Math.random() * items.length)]);
  };

  if (loading) {
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        color: '#c8aa6e',
        fontSize: '1.5rem'
      }
    }, 'Chargement des items...');
  }

  if (gameOver) {
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        padding: '2rem'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '600px',
          textAlign: 'center',
          background: 'rgba(15,15,20,0.8)',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '2px solid rgba(245,158,11,0.5)'
        }
      },
        React.createElement('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '🏆'),
        React.createElement('h2', { style: { fontSize: '2.5rem', color: '#f59e0b', marginBottom: '1rem' } }, 'Partie terminée !'),
        React.createElement('p', { style: { fontSize: '1.5rem', color: '#f0e6d2', marginBottom: '0.5rem' } }, `Score total : ${score} points`),
        React.createElement('p', { style: { fontSize: '1.2rem', color: '#c8aa6e', marginBottom: '2rem' } }, `Moyenne : ${Math.round(score / MAX_ROUNDS)} pts/round`),
        React.createElement('button', {
          onClick: resetGame,
          style: {
            padding: '1rem 2.5rem',
            fontSize: '1.2rem',
            borderRadius: '10px',
            border: 'none',
            background: '#f59e0b',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
          },
          onMouseEnter: e => e.currentTarget.style.background = '#d97706',
          onMouseLeave: e => e.currentTarget.style.background = '#f59e0b'
        }, '🔄 Rejouer')
      )
    );
  }

  if (!currentItem) return null;

  const difference = showResult ? Math.abs(parseInt(userGuess) - currentItem.price) : 0;

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      padding: '2rem 1rem',
      color: '#f0e6d2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }
  },
    React.createElement('div', { style: { maxWidth: '700px', margin: '0 auto' } },
      React.createElement('h2', { style: { textAlign: 'center', color: '#f59e0b', fontSize: '2.5rem', marginBottom: '1rem' } }, '💰 Devine le Prix'),

      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(15,15,20,0.6)',
          borderRadius: '10px'
        }
      },
        React.createElement('div', { style: { color: '#c8aa6e', fontSize: '1.2rem', fontWeight: 600 } }, `Round ${round}/${MAX_ROUNDS}`),
        React.createElement('div', { style: { color: '#f59e0b', fontSize: '1.4rem', fontWeight: 700 } }, `Score: ${score}`)
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(15,15,20,0.8)',
          padding: '3rem 2rem',
          borderRadius: '16px',
          border: '2px solid rgba(245,158,11,0.3)',
          textAlign: 'center'
        }
      },
        React.createElement('img', {
          src: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${currentItem.icon}`,
          alt: currentItem.name,
          style: {
            width: '150px',
            height: '150px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
          }
        }),
        
        React.createElement('h3', { style: { fontSize: '1.8rem', color: '#f0e6d2', marginBottom: '2rem' } }, currentItem.name),

        !showResult ? React.createElement('div', null,
          React.createElement('input', {
            type: 'number',
            value: userGuess,
            onChange: e => setUserGuess(e.target.value),
            onKeyPress: e => e.key === 'Enter' && handleSubmit(),
            placeholder: 'Entre le prix en or...',
            style: {
              width: '100%',
              maxWidth: '300px',
              padding: '1rem',
              fontSize: '1.3rem',
              borderRadius: '10px',
              border: '2px solid rgba(245,158,11,0.3)',
              background: 'rgba(10,10,12,0.6)',
              color: '#fff',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }
          }),
          
          React.createElement('button', {
            onClick: handleSubmit,
            disabled: !userGuess,
            style: {
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              borderRadius: '10px',
              border: 'none',
              background: userGuess ? '#f59e0b' : '#555',
              color: '#fff',
              cursor: userGuess ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              boxShadow: userGuess ? '0 4px 12px rgba(245,158,11,0.3)' : 'none'
            },
            onMouseEnter: e => userGuess && (e.currentTarget.style.background = '#d97706'),
            onMouseLeave: e => userGuess && (e.currentTarget.style.background = '#f59e0b')
          }, 'Valider')
        ) : React.createElement('div', null,
          React.createElement('div', {
            style: {
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#f59e0b',
              marginBottom: '1rem',
              padding: '1rem',
              background: 'rgba(245,158,11,0.1)',
              borderRadius: '10px'
            }
          }, `Prix réel : ${currentItem.price} 💰`),

          React.createElement('div', {
            style: {
              fontSize: '1.3rem',
              color: difference <= 100 ? '#10b981' : difference <= 500 ? '#f59e0b' : '#ef4444',
              marginBottom: '1rem'
            }
          }, 
            difference === 0 ? '🎯 Parfait !' : 
            difference <= 100 ? '✅ Très proche !' :
            difference <= 300 ? '👍 Pas mal !' :
            difference <= 500 ? '😐 Moyen...' :
            '❌ Raté !'
          ),

          React.createElement('div', { style: { fontSize: '1.1rem', color: '#c8aa6e' } }, `Ta réponse : ${userGuess} (différence : ${difference})`)
        )
      )
    )
  );
}

// Lancer le jeu
(() => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(React.createElement(PriceGuessGame), root);
  }
})();
