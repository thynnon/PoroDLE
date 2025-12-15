// utils.js
function isRanged(champ) {
  try {
    return champ.stats && Number(champ.stats.attackrange) > 200;
  } catch {
    return false;
  }
}

function compareAttr(guessVal, targetVal, type = 'exact') {
  if (type === 'exact') {
    return guessVal === targetVal ? 'correct' : 'incorrect';
  }
  
  if (type === 'year') {
    const diff = Math.abs(Number(guessVal) - Number(targetVal));
    if (diff === 0) return 'correct';
    if (diff <= 2) return 'partial';
    return 'incorrect';
  }
  
  if (type === 'array') {
    const gArr = Array.isArray(guessVal) ? guessVal : [guessVal].filter(Boolean);
    const tArr = Array.isArray(targetVal) ? targetVal : [targetVal].filter(Boolean);
    const hasCommon = gArr.some(v => tArr.includes(v));
    
    if (gArr.length === tArr.length && gArr.every(v => tArr.includes(v))) {
      return 'correct';
    }
    if (hasCommon) return 'partial';
    return 'incorrect';
  }
  
  return 'incorrect';
}

function getArrow(guessVal, targetVal) {
  if (guessVal === targetVal) return '';
  return Number(guessVal) < Number(targetVal) ? '↑' : '↓';
}