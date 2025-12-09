// components.js
function SearchDropdown({ champions, searchInput, onSelect, version }) {
  if (!searchInput.trim()) return null;
  
  const filtered = champions
    .filter(c => c.nom.toLowerCase().includes(searchInput.toLowerCase()))
    .slice(0, 10);
  
  if (filtered.length === 0) return null;
  
  return React.createElement('div', { className: 'search-dropdown' },
    filtered.map(ch => 
      React.createElement('div', {
        key: ch.id,
        className: 'search-item',
        onClick: () => onSelect(ch)
      },
        React.createElement('img', {
          src: DDRAGON.champIcon(version, ch.id),
          alt: ch.nom
        }),
        React.createElement('div', null,
          React.createElement('div', { className: 'search-item-name' }, ch.nom),
          React.createElement('div', { className: 'search-item-meta' }, 
            (ch.roles || []).join(' • ')
          )
        )
      )
    )
  );
}

function Legend({ show }) {
  if (!show) return null;
  
  return React.createElement('div', { className: 'glass legend' },
    React.createElement('div', { className: 'legend-item' },
      React.createElement('div', { className: 'legend-box correct' }, '✓'),
      React.createElement('div', { className: 'legend-label' }, 'Correct')
    ),
    React.createElement('div', { className: 'legend-item' },
      React.createElement('div', { className: 'legend-box partial' }, '~'),
      React.createElement('div', { className: 'legend-label' }, 'Partiel')
    ),
    React.createElement('div', { className: 'legend-item' },
      React.createElement('div', { className: 'legend-box incorrect' }, '✗'),
      React.createElement('div', { className: 'legend-label' }, 'Incorrect')
    )
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return React.createElement('div', { 
    className: 'modal-overlay',
    onClick: onClose
  },
    React.createElement('div', {
      className: 'modal-content',
      onClick: (e) => e.stopPropagation()
    },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h2', { className: 'modal-title' }, title),
        React.createElement('button', {
          className: 'modal-close',
          onClick: onClose
        }, '×')
      ),
      React.createElement('div', { className: 'modal-body' }, children)
    )
  );
}

function RulesModal({ isOpen, onClose }) {
  return React.createElement(Modal, { isOpen, onClose, title: '📖 Règles du jeu' },
    React.createElement('p', null, 
      'Bienvenue sur LoLdle ! Le but du jeu est de deviner le champion mystère en utilisant les indices fournis après chaque tentative.'
    ),
    
    React.createElement('h3', null, '🎯 Comment jouer ?'),
    React.createElement('ul', null,
      React.createElement('li', null, '🔍 Recherchez et sélectionnez un champion dans la barre de recherche'),
      React.createElement('li', null, '💡 Observez les indices colorés pour chaque catégorie'),
      React.createElement('li', null, '🔄 Continuez à deviner jusqu\'à trouver le bon champion'),
      React.createElement('li', null, '🏆 Trouvez le champion en un minimum de tentatives !')
    ),
    
    React.createElement('h3', null, '🎨 Signification des couleurs'),
    React.createElement('ul', null,
      React.createElement('li', null,
        React.createElement('span', { className: 'color-indicator green' }),
        'Vert (Correct) : L\'attribut correspond exactement'
      ),
      React.createElement('li', null,
        React.createElement('span', { className: 'color-indicator orange' }),
        'Orange (Partiel) : L\'attribut est proche (année ±2 ans)'
      ),
      React.createElement('li', null,
        React.createElement('span', { className: 'color-indicator red' }),
        'Rouge (Incorrect) : L\'attribut ne correspond pas'
      )
    ),
    
    React.createElement('h3', null, '📊 Indices disponibles'),
    React.createElement('ul', null,
      React.createElement('li', null, '⚥ Genre : Homme, Femme ou Autre'),
      React.createElement('li', null, '🗺️ Position : Top, Jungle, Mid, ADC, Support'),
      React.createElement('li', null, '🧬 Espèce : Type de créature du champion'),
      React.createElement('li', null, '💧 Ressource : Mana, Énergie, Rage, etc.'),
      React.createElement('li', null, '⚔️ Portée : Mêlée ou Distance'),
      React.createElement('li', null, '🏰 Région : Région d\'origine dans Runeterra'),
      React.createElement('li', null, '📅 Année : Année de sortie (avec flèche ↑ ou ↓)')
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
      '✨ Bonne chance, invocateur ! 🎮'
    )
  );
}

function SettingsModal({ isOpen, onClose, settings, onSettingChange }) {
  return React.createElement(Modal, { isOpen, onClose, title: '⚙️ Paramètres' },
    React.createElement('div', { className: 'settings-option' },
      React.createElement('span', { className: 'settings-label' }, 'Afficher la légende automatiquement'),
      React.createElement('div', {
        className: `settings-toggle ${settings.autoShowLegend ? 'active' : ''}`,
        onClick: () => onSettingChange('autoShowLegend', !settings.autoShowLegend)
      },
        React.createElement('div', { className: 'settings-toggle-thumb' })
      )
    ),
    React.createElement('p', { style: { marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(240, 230, 210, 0.6)' } },
      'Plus de paramètres à venir...'
    )
  );
}
