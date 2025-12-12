// app.js - Gestionnaire principal de l'application avec page d'accueil

// =====================================================
// COMPOSANT : Frise des modes (navigation)
// =====================================================
function GameFrise({ activeMode, onSelectMode }) {
  const modes = [
    { name: 'CLASSIQUE', icon: '❓' },
    { name: 'CITATIONS', icon: '💬' },
    { name: 'SPELLS', icon: '🔥' },
    { name: 'SPLASHART', icon: '🖼️' },
    { name: 'ITEMS', icon: '🛡️' },
    { name: 'SUDOKU', icon: '🧩' }
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
      width: 'fit-content'
    }
  },
    modes.map((mode, index) => {
      const isActive = mode.name === activeMode;
      return [
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
function Header({ reset, setShowSettings, activeMode, onSelectMode, onBackHome }) {
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
        onClick: onBackHome,
        title: 'Retour à l\'accueil'
      }, '🏠 ACCUEIL'),
      
      React.createElement('button', {
        className: 'btn btn-secondary',
        onClick: () => setShowSettings(true)
      }, '⚙️ PARAMÈTRES'),

      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: reset
      }, '🔄 NOUVEAU')
    ),

    React.createElement('img', {
      src: './img/logo.png',
      alt: 'LOLDLE',
      className: 'logo-image',
      style: { marginBottom: '1rem', cursor: 'pointer' },
      onClick: onBackHome
    }),

    React.createElement(GameFrise, { activeMode, onSelectMode }),

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
  const [activeMode, setActiveMode] = React.useState(window.INITIAL_MODE || 'CLASSIQUE');
  const [showSettings, setShowSettings] = React.useState(false);
  const [resetFlag, setResetFlag] = React.useState(0);

  React.useEffect(() => {
    loadChampionData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  const handleReset = () => setResetFlag(prev => prev + 1);
  
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setResetFlag(prev => prev + 1);
    
    // Mettre à jour l'URL
    window.history.pushState({}, '', `?mode=${mode}`);
  };

  const handleBackHome = () => {
    // Retour à la page d'accueil
    document.body.classList.remove('react-active');
    window.history.pushState({}, '', '/');
  };

  // Exposer la fonction pour permettre le changement de mode depuis l'extérieur
  React.useEffect(() => {
    window.triggerModeChange = (mode) => {
      setActiveMode(mode);
      setResetFlag(prev => prev + 1);
    };
  }, []);

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
        React.createElement('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '⚡'),
        React.createElement('div', { className: 'title neon' }, 'Chargement...')
      )
    );
  }

  // Sélection du mode actif
  let ModeComponent = null;

  switch (activeMode) {
    case 'CLASSIQUE':
      ModeComponent = ClassicMode;
      break;
    case 'SPELLS':
      ModeComponent = SpellsMode;
      break;
    case 'CITATIONS':
      ModeComponent = CitationsMode;
      break;
    case 'SPLASHART':
      ModeComponent = SplashartMode;
      break;
    case 'ITEMS':
      ModeComponent = ItemsMode;
      break;
    case 'SUDOKU':
      ModeComponent = SudokuMode;
      break;
    default:
      ModeComponent = ClassicMode;
  }

  return React.createElement('div', { className: 'container' },
    React.createElement(Header, {
      reset: handleReset,
      setShowSettings,
      activeMode,
      onSelectMode: handleModeChange,
      onBackHome: handleBackHome
    }),

    React.createElement(ModeComponent, {
      champions: data.champions,
      version: data.version,
      resetFlag,
      setShowSettings,
      onNextMode: handleModeChange,
      currentMode: activeMode
    }),

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