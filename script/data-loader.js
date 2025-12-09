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