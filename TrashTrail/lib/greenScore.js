export function calculateGreenScore(actions) {
  let score = 0;
  
  const points = {
    'created bag': 10,
    'proper segregation': 15,
    'waste recycled': 20,
    'complaint filed': 5,
    'consistent': 25,
    'referral': 30
  };

  if(!Array.isArray(actions)) return 0;

  actions.forEach(action => {
    // Basic fuzzy string handling
    const normalized = action.toLowerCase();
    if (points[normalized]) {
      score += points[normalized];
    }
  });

  return score;
}
