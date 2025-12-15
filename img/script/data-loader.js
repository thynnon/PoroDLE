// data-loader.js
async function loadChampionData() {
  try {
    // Récupérer la version
    const vRes = await fetch(DDRAGON.versionsUrl);
    const versions = await vRes.json();
    const latest = versions[0] || "14.22.1";
    
    // Récupérer les champions
    const champsRes = await fetch(DDRAGON.championData(latest, 'fr_FR'));
    const champsJson = await champsRes.json();
    const champList = Object.values(champsJson.data || {});
    
    // Normaliser les données
    const championsNormalized = champList.map(c => ({
      id: c.id,
      nom: c.name,
      roles: c.tags || [],
      partype: c.partype || '',
      stats: c.stats || {},
      sex: GENDER_MAP[c.id] || 'Autre',
      position: POSITION_MAP[c.id] || 'Flex',
      region: REGION_MAP[c.id] || 'Inconnu',
      species: SPECIES_MAP[c.id] || 'Inconnu',
      year: YEAR_MAP[c.id] || 2009
    }));
    
    return { version: latest, champions: championsNormalized };
  } catch (err) {
    console.error('Erreur chargement données:', err);
    return { version: '14.22.1', champions: [] };
  }
}

// Nouvelle fonction pour charger les détails d'un champion (avec ses sorts)
async function loadChampionDetails(championId, version) {
  try {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${championId}.json`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Récupérer les données du champion
    const champData = data.data[championId];
    
    if (!champData) {
      console.error('Champion data not found for:', championId);
      return null;
    }
    
    // Structurer les sorts
    const spells = {
      passive: {
        name: champData.passive.name,
        description: champData.passive.description,
        image: champData.passive.image.full
      },
      Q: champData.spells[0] ? {
        name: champData.spells[0].name,
        description: champData.spells[0].description,
        image: champData.spells[0].image.full
      } : null,
      W: champData.spells[1] ? {
        name: champData.spells[1].name,
        description: champData.spells[1].description,
        image: champData.spells[1].image.full
      } : null,
      E: champData.spells[2] ? {
        name: champData.spells[2].name,
        description: champData.spells[2].description,
        image: champData.spells[2].image.full
      } : null,
      R: champData.spells[3] ? {
        name: champData.spells[3].name,
        description: champData.spells[3].description,
        image: champData.spells[3].image.full
      } : null
    };
    
    return {
      id: championId,
      name: champData.name,
      spells: spells
    };
    
  } catch (err) {
    console.error('Erreur chargement détails champion:', championId, err);
    return null;
  }
}