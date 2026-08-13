/**
 * Serialize tactical squad state into a compact URL-safe string
 */
export function serializeSquadState(squadData) {
  try {
    const compactState = {
      t: squadData.teamInfo,
      f: squadData.formationId,
      k: squadData.kitStyle,
      gk: squadData.gkKitStyle,
      p: squadData.players.map((p) => ({
        n: p.name,
        num: p.number,
        pos: p.pos,
        r: p.rating,
        c: p.isCaptain ? 1 : 0,
        x: p.x,
        y: p.y
      })),
      b: squadData.bench.map((b) => ({
        n: b.name,
        num: b.number,
        pos: b.pos
      }))
    };

    const jsonString = JSON.stringify(compactState);
    return btoa(encodeURIComponent(jsonString));
  } catch (err) {
    console.error('Serialization error:', err);
    return '';
  }
}

/**
 * Decode URL serialized state back into squad object
 */
export function deserializeSquadState(encodedString) {
  try {
    const jsonString = decodeURIComponent(atob(encodedString));
    const data = JSON.parse(jsonString);

    return {
      teamInfo: data.t || { teamName: 'Custom XI', managerName: '', matchInfo: '' },
      formationId: data.f || '4-3-3',
      kitStyle: data.k || { primaryColor: '#10b981', secondaryColor: '#064e3b', pattern: 'solid' },
      gkKitStyle: data.gk || { primaryColor: '#f59e0b', secondaryColor: '#b45309', pattern: 'solid' },
      players: (data.p || []).map((p, idx) => ({
        id: idx + 1,
        name: p.n || '',
        number: p.num || idx + 1,
        pos: p.pos || 'CM',
        rating: p.r || null,
        isCaptain: p.c === 1,
        x: p.x,
        y: p.y
      })),
      bench: (data.b || []).map((b, idx) => ({
        id: 100 + idx + 1,
        name: b.n || '',
        number: b.num || 12 + idx,
        pos: b.pos || 'SUB'
      }))
    };
  } catch (err) {
    console.error('Deserialization error:', err);
    return null;
  }
}
