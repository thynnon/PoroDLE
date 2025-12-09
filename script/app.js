// app.js - Gestionnaire principal de l'application

// =====================================================
// COMPOSANT : Frise des modes (navigation)
// =====================================================
function GameFrise({ activeMode, onSelectMode }) {
  const modes = [
    { name: 'CLASSIQUE', icon: '❓', file: 'classique' },
    { name: 'CITATIONS', icon: '💬', file: 'citations' },
    { name: 'SPELLS', icon: '🔥', file: 'spells' },
    { name: 'ITEMS', icon: '🛡️', file: 'items' },
    { name: 'SUDOKU', icon: '🎮', file: 'sudoku' }
  ];

  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      margin: '1.5rem 0',
      padding: '1rem',
      borderRadius: '15px',
      width: 'fit-content',
    }
  },
    modes.map((mode, index) => {
      const isActive = mode.name === activeMode;
      return [
        // Cercle du mode
        React.createElement('div', {
          key: mode.name,
          onClick: () => onSelectMode(mode.name),
          style: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isActive ? '#ffa500' : '#333',
            boxShadow: isActive ? '0 0 20px #ffa500' : 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '1.8rem',
            userSelect: 'none',
            transition: 'all 0.2s',
            border: '2px solid #555',
            position: 'relative',
            zIndex: 2
          },
          title: mode.name
        }, mode.icon),

        // Trait entre les cercles
        index < modes.length - 1 && React.createElement('div', {
          key: 'connector-' + index,
          style: {
            width: '30px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, #00ffff 20%, #00ffff80 80%, transparent 100%)',
            borderRadius: '2px',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 0 5px #00ffff60'
          }
        })
      ];
    }).flat()
  );
}

// =====================================================
// COMPOSANT : Header global
// =====================================================
function Header({ reset, setShowSettings, activeMode, onSelectMode }) {
  return React.createElement('div', {
    className: 'header-visual',
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
      gap: '1.5rem',
      position: 'relative'
    }
  },
    // Boutons fixes en haut à droite
    React.createElement('div', {
      style: {
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 1000
      }
    },
      React.createElement('button', { 
        className: 'btn btn-secondary', 
        onClick: () => setShowSettings(true) 
      }, '⚙️ PARAMÈTRES'),
      React.createElement('button', { 
        className: 'btn btn-primary', 
        onClick: reset 
      }, '🔄 NOUVEAU')
    ),
    
    // Logo
    React.createElement('img', {
      src: '../img/logo.png',
      alt: 'LOLDLE',
      className: 'logo-image',
      style: { marginBottom: '1rem' }
    }),
    
    // Frise des modes
    React.createElement(GameFrise, { activeMode, onSelectMode }),
    
    // Titre centré
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement('h2', { 
        className: 'title-neon-glow', 
        style: { fontSize: '2.8rem', marginBottom: '0.5rem' } 
      }, `MODE ${activeMode}`),
      React.createElement('p', { 
        className: 'subtitle-epic', 
        style: { fontSize: '1.2rem' } 
      }, 'Chaque indice compte… Sauras-tu révéler le champion mystère ?')
    )
  );
}

// =====================================================
// COMPOSANT PRINCIPAL : App
// =====================================================
function App() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activeMode, setActiveMode] = React.useState('CLASSIQUE');
  const [showSettings, setShowSettings] = React.useState(false);
  const [resetFlag, setResetFlag] = React.useState(0);

  // Chargement initial des données
  React.useEffect(() => {
    loadChampionData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  // Handler pour le reset
  const handleReset = () => {
    setResetFlag(prev => prev + 1);
  };

  // Handler pour le changement de mode
  const handleModeChange = (newMode) => {
    setActiveMode(newMode);
    setResetFlag(prev => prev + 1); // Reset le jeu quand on change de mode
  };

  // Écran de chargement
  if (loading) {
    return React.createElement('div', {
      className: 'container',
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }
    },
      React.createElement('div', { style: { textAlign: 'center' } },
        React.createElement('div', { 
          style: { fontSize: '4rem', marginBottom: '1rem' } 
        }, '⚡'),
        React.createElement('div', { 
          className: 'title neon' 
        }, 'Chargement...')
      )
    );
  }

  // Sélection du composant de mode à afficher
  let ModeComponent = null;
  switch(activeMode) {
    case 'CLASSIQUE':
      ModeComponent = ClassicMode;
      break;
    case 'SPELLS':
      ModeComponent = SpellsMode;
      break;
    case 'CITATIONS':
      ModeComponent = CitationsMode;
      break;
    case 'ITEMS':
    case 'SUDOKU':
      // Ces modes seront créés plus tard
      ModeComponent = () => React.createElement('div', {
        className: 'container',
        style: { textAlign: 'center', padding: '3rem' }
      },
        React.createElement('h2', { style: { fontSize: '2rem', marginBottom: '1rem' } }, 
          `Mode ${activeMode} - En développement`
        ),
        React.createElement('p', { style: { fontSize: '1.2rem', opacity: 0.7 } }, 
          'Ce mode sera bientôt disponible ! 🚧'
        )
      );
      break;
    default:
      ModeComponent = ClassicMode;
  }

  return React.createElement('div', { className: 'container' },
    // Header global avec navigation
    React.createElement(Header, {
      reset: handleReset,
      setShowSettings,
      activeMode,
      onSelectMode: handleModeChange
    }),
    
    // Rendu du mode actif
    React.createElement(ModeComponent, {
      champions: data.champions,
      version: data.version,
      resetFlag,
      setShowSettings,
      onNextMode: handleModeChange,
      currentMode: activeMode
    }),
    
    // Modal des paramètres
    React.createElement(SettingsModal, {
      isOpen: showSettings,
      onClose: () => setShowSettings(false),
      settings: {},
      onSettingChange: () => {}
    })
  );
}

// =====================================================
// INITIALISATION
// =====================================================
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(React.createElement(App));