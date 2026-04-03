export function detectAnomalies(wasteBag) {
  const now = new Date();
  const bagCreated = new Date(wasteBag.createdAt);
  const hoursSinceCreation = Math.abs(now - bagCreated) / 36e5; // ms to hours map

  // 1. WEIGHT MISMATCH
  if (wasteBag.weightAtSource && wasteBag.weightAtCollection) {
    const diff = Math.abs(wasteBag.weightAtSource - wasteBag.weightAtCollection);
    const percentDiff = (diff / wasteBag.weightAtSource) * 100;

    if (percentDiff > 40) {
      return {
        detected: true,
        type: 'weight_mismatch',
        severity: 'high',
        description: `Weight mismatch: Source ${wasteBag.weightAtSource}kg vs Collected ${wasteBag.weightAtCollection}kg (${percentDiff.toFixed(1)}% difference)`
      };
    } else if (percentDiff > 20) {
      return {
        detected: true,
        type: 'weight_mismatch',
        severity: 'medium',
        description: `Weight mismatch: Source ${wasteBag.weightAtSource}kg vs Collected ${wasteBag.weightAtCollection}kg (${percentDiff.toFixed(1)}% difference)`
      };
    }
  }

  // 2. MISSED PICKUP
  if (wasteBag.status === 'created') {
    if (hoursSinceCreation > 48) {
      return {
        detected: true,
        type: 'missed_pickup',
        severity: 'high',
        description: `Waste bag ${wasteBag.qrCode} not picked up for ${Math.floor(hoursSinceCreation)} hours`
      };
    } else if (hoursSinceCreation > 24) {
      return {
        detected: true,
        type: 'missed_pickup',
        severity: 'medium',
        description: `Waste bag ${wasteBag.qrCode} not picked up for ${Math.floor(hoursSinceCreation)} hours`
      };
    }
  }

  // 3. DELAYED PROCESSING
  if (wasteBag.status === 'at_facility') {
    const facilityEntry = wasteBag.timeline.find(t => t.status === 'at_facility');
    if (facilityEntry) {
      const facilityTime = new Date(facilityEntry.timestamp);
      const hoursAtFacility = Math.abs(now - facilityTime) / 36e5;

      if (hoursAtFacility > 72) {
        return {
          detected: true,
          type: 'delayed_processing',
          severity: 'medium',
          description: `Waste bag ${wasteBag.qrCode} at facility for ${Math.floor(hoursAtFacility)} hours without processing`
        };
      } else if (hoursAtFacility > 48) {
        return {
          detected: true,
          type: 'delayed_processing',
          severity: 'low',
          description: `Waste bag ${wasteBag.qrCode} at facility for ${Math.floor(hoursAtFacility)} hours without processing`
        };
      }
    }
  }

  return { detected: false };
}
