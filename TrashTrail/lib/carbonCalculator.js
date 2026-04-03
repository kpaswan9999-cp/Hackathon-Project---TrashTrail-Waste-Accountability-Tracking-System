export function calculateCarbonImpact(wasteType, weightKg) {
  const rates = {
    plastic: 1.5,
    paper: 0.9,
    metal: 4.0,
    glass: 0.3,
    organic: 0.5,
    mixed: 0.4,
    e_waste: 2.5,
    hazardous: 0.1
  };
  
  // Clean arbitrary formats like e-waste to match map
  const normalizedType = String(wasteType).toLowerCase().replace('-', '_');
  const savingRate = rates[normalizedType] || rates.mixed;
  
  const carbonSaved = Number((savingRate * weightKg).toFixed(2));
  const treesEquivalent = Number((carbonSaved / 21).toFixed(2));
  const carKmEquivalent = Number((carbonSaved / 0.21).toFixed(2));
  
  return {
    carbonSaved,
    treesEquivalent,
    carKmEquivalent,
    description: `You saved ${carbonSaved} kg CO2, equivalent to planting ${treesEquivalent} trees or taking a car off the road for ${carKmEquivalent} km.`
  };
}
