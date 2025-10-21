// 🌐 Global satellite cache and coverage layer
let cachedSatellites = [];
let lastFetchTime = null;
const coverageLayer = L.layerGroup();

async function fetchSatellites(inclinationMin = 0, inclinationMax = 180) {
  const now = Date.now();

  // If cached and less than 2 hours old, reuse
  if (cachedSatellites.length > 0 && lastFetchTime && (now - lastFetchTime < 2 * 60 * 60 * 1000)) {
    console.log("📦 Using cached satellite data (fresh)");

    // Filter cached satellites by inclination
    const filtered = cachedSatellites.filter(({ satrec }) => {
      const incl = satrec.inclo * (180 / Math.PI);
      return incl >= inclinationMin && incl <= inclinationMax;
    });

    console.log(`🔍 Filtered cached satellites to ${filtered.length} with inclination ${inclinationMin}–${inclinationMax}°`);
    return filtered;
  }

  const tleUrl = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle';
  try {
    const response = await fetch(tleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0' // helps avoid 403 errors
      }
    });
    const tleText = await response.text();
    const tleLines = tleText.split('\n').filter(line => line.trim() !== '');

    cachedSatellites = [];
    for (let i = 0; i < tleLines.length && cachedSatellites.length < 4000; i += 3) {
      const name = tleLines[i];
      const tle1 = tleLines[i + 1];
      const tle2 = tleLines[i + 2];

      try {
        const satrec = satellite.twoline2satrec(tle1, tle2);
        cachedSatellites.push({ name, satrec });
      } catch (err) {
        console.warn(`❌ Failed to parse TLE for ${name}`);
      }
    }

    lastFetchTime = now; // ✅ Update timestamp
    console.log(`✅ Fetched and cached ${cachedSatellites.length} satellites`);

    // Filter newly fetched satellites by inclination
    const filtered = cachedSatellites.filter(({ satrec }) => {
      const incl = satrec.inclo * (180 / Math.PI);
      return incl >= inclinationMin && incl <= inclinationMax;
    });

    console.log(`🔍 Filtered satellites to ${filtered.length} with inclination ${inclinationMin}–${inclinationMax}°`);
    return filtered;
  } catch (error) {
    console.error("❌ Error fetching TLE data:", error);
    return [];
  }
}


// async function loadSatellites(hexagons, map, minutesFromNow = 0, limitSatellites = false) {
//     console.log(`🚀 loadSatellites() started for 24-hour average coverage`);
  
//     const satellites = await fetchSatellites();
//     if (satellites.length === 0) return;
  
//     const activeSatellites = limitSatellites
//       ? satellites.slice(0, 800)
//       : satellites.slice(0, Math.min(4000, satellites.length));
  
//     const footprintRadiusKm = 600;
//     const coverageSums = new Map();
  
//     for (let hour = 0; hour < 24; hour++) {
//       const now = new Date();
//       now.setHours(now.getHours() + hour);
//       const gmst = satellite.gstime(now);
  
//       activeSatellites.forEach(({ satrec }) => {
//         const positionAndVelocity = satellite.propagate(satrec, now);
//         const positionEci = positionAndVelocity.position;
//         if (!positionEci) return;
  
//         const positionGd = satellite.eciToGeodetic(positionEci, gmst);
//         const lat = satellite.degreesLat(positionGd.latitude);
//         const lng = satellite.degreesLong(positionGd.longitude);
  
//         hexagons.forEach(h3Index => {
//           const [hexLat, hexLng] = h3.cellToLatLng(h3Index);
//           const distance = haversineDistance(lat, lng, hexLat, hexLng);
//           if (distance <= footprintRadiusKm) {
//             coverageSums.set(h3Index, (coverageSums.get(h3Index) || 0) + 1);
//           }
//         });
//       });
//     }
  
//     // ✅ Compute averages
//     const coverageAverages = new Map();
//     hexagons.forEach(h3Index => {
//       const total = coverageSums.get(h3Index) || 0;
//       coverageAverages.set(h3Index, total / 24);
//     });
  
//     console.log(`✅ Averaged coverage map built with ${coverageAverages.size} hexes`);
  
//     coverageLayer.clearLayers();
//     coverageLayer.addTo(map);
  
//     hexagons.forEach(h3Index => {
//       const boundary = h3.cellToBoundary(h3Index, true);
//       const latlngs = boundary.map(([lat, lng]) => [lat, lng]);
  
//       const avgCount = coverageAverages.get(h3Index) || 0;
//       const color = limitSatellites
//         ? getPreviewCoverageColor(avgCount)
//         : getCoverageColor(avgCount);
  
//       L.polygon(latlngs, {
//         color,
//         weight: 1,
//         fillColor: color,
//         fillOpacity: 0.6
//       }).addTo(coverageLayer);
//     });
  
//     // 📊 Analyze coverage distribution
//     const counts = Array.from(coverageAverages.values());
//     if (counts.length === 0) {
//       console.warn("⚠️ No coverage data to analyze.");
//     } else {
//       counts.sort((a, b) => a - b);
//       const min = counts[0];
//       const max = counts[counts.length - 1];
//       const sum = counts.reduce((acc, val) => acc + val, 0);
//       const mean = sum / counts.length;
//       const median =
//         counts.length % 2 === 0
//           ? (counts[counts.length / 2 - 1] + counts[counts.length / 2]) / 2
//           : counts[Math.floor(counts.length / 2)];
//       const modeMap = new Map();
//       let mode = counts[0], maxFreq = 0;
//       counts.forEach(val => {
//         const freq = (modeMap.get(val) || 0) + 1;
//         modeMap.set(val, freq);
//         if (freq > maxFreq) {
//           maxFreq = freq;
//           mode = val;
//         }
//       });
  
//       console.log("📈 Coverage Stats (24-hour average):");
//       console.log(`• Min: ${min.toFixed(2)}`);
//       console.log(`• Max: ${max.toFixed(2)}`);
//       console.log(`• Mean: ${mean.toFixed(2)}`);
//       console.log(`• Median: ${median.toFixed(2)}`);
//       console.log(`• Mode: ${mode.toFixed(2)} (appears ${maxFreq} times)`);
//     }
//   }

async function loadSatellites(hexagons, map, minutesFromNow = 0, limitSatellites = false, inclinationMin = 0, inclinationMax = 180, regionId = "default") {
  console.log(`🚀 loadSatellites() started for 2-hour coverage with inclination ${inclinationMin}–${inclinationMax}°`);

  const cachedCoverage = localStorage.getItem(`coverageMap_${regionId}`);
  const cachedStability = localStorage.getItem(`coverageStability_${regionId}`);
  const cachedTime = parseInt(localStorage.getItem(`coverageTimestamp_${regionId}`), 10);

  const now = Date.now();

  if (cachedCoverage && cachedStability && cachedTime && (now - cachedTime < 2 * 60 * 60 * 1000)) {
    console.log("📦 Using cached coverage and stability maps from localStorage");

    const coverageObject = JSON.parse(cachedCoverage);
    const stabilityObject = JSON.parse(cachedStability);

    const coverageMap = new Map(Object.entries(coverageObject).map(([key, val]) => [key, parseFloat(val)]));
    const coverageStability = new Map(Object.entries(stabilityObject).map(([key, val]) => [key, parseFloat(val)]));

    renderCoverage(coverageMap, hexagons, map, limitSatellites, coverageStability);
    window.coverageAverages = coverageMap;
    window.coverageStability = coverageStability;
    
    console.log("✅ Global coverageAverages set:", window.coverageAverages?.size);
    console.log("✅ Global coverageStability set:", window.coverageStability?.size);
    return;
  }

  const satellites = await fetchSatellites(inclinationMin, inclinationMax);
  console.log(`📡 Using ${satellites.length} satellites in inclination range ${inclinationMin}–${inclinationMax}°`);
  if (satellites.length === 0) return;

  const activeSatellites = limitSatellites
    ? satellites.slice(0, 800)
    : satellites.slice(0, Math.min(4000, satellites.length));

  const footprintRadiusKm = 600;
  const coverageSums = new Map();
  const hourlyCounts = new Map(); // h3Index → array of 24 hourly counts

  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date(Date.now() + (minutesFromNow + hour * 60) * 60 * 1000);
    const gmst = satellite.gstime(timestamp);

    activeSatellites.forEach(({ satrec }) => {
      const positionAndVelocity = satellite.propagate(satrec, timestamp);
      const positionEci = positionAndVelocity.position;
      if (!positionEci) return;

      const positionGd = satellite.eciToGeodetic(positionEci, gmst);
      const lat = satellite.degreesLat(positionGd.latitude);
      const lng = satellite.degreesLong(positionGd.longitude);

      hexagons.forEach(h3Index => {
        const [hexLat, hexLng] = h3.cellToLatLng(h3Index);
        const distance = haversineDistance(lat, lng, hexLat, hexLng);
        if (distance <= footprintRadiusKm) {
          coverageSums.set(h3Index, (coverageSums.get(h3Index) || 0) + 1);

          if (!hourlyCounts.has(h3Index)) {
            hourlyCounts.set(h3Index, Array(24).fill(0));
          }
          hourlyCounts.get(h3Index)[hour]++;
        }
      });
    });

    console.log(`⏱️ Hour ${hour} coverage accumulated`);
  }

  console.log(`📦 hourlyCounts size: ${hourlyCounts.size}`);
  let sample = 0;
  for (const [h3Index, hourlyArray] of hourlyCounts.entries()) {
    console.log(`• ${h3Index}: [${hourlyArray.join(", ")}]`);
    if (++sample >= 5) break;
  }

  // ✅ Compute averages
  const coverageAverages = new Map();
  hexagons.forEach(h3Index => {
    const total = coverageSums.get(h3Index) || 0;
    coverageAverages.set(h3Index, total / 24);
  });

  // ✅ Compute stability scores
  const coverageStability = new Map();
  hourlyCounts.forEach((hourlyArray, h3Index) => {
    const mean = coverageAverages.get(h3Index) || 0;
    const variance = hourlyArray.reduce((acc, val) => acc + (val - mean) ** 2, 0) / hourlyArray.length;
    const stability = 1 / (variance + 1); // lower variance → higher stability
    coverageStability.set(h3Index, stability);
  });

  console.log(`✅ Averaged coverage map built with ${coverageAverages.size} hexes`);

  renderCoverage(coverageAverages, hexagons, map, limitSatellites, coverageStability);

  // ✅ Cache both coverage and stability
  localStorage.setItem(`coverageMap_${regionId}`, JSON.stringify(Object.fromEntries(coverageAverages)));
  localStorage.setItem(`coverageStability_${regionId}`, JSON.stringify(Object.fromEntries(coverageStability)));
  localStorage.setItem(`coverageTimestamp_${regionId}`, Date.now().toString());


  console.log("📈 Coverage rendering complete and cached");


}

function renderCoverage(coverageMap, hexagons, map, limitSatellites, coverageStability = null) {
  console.log(`🧭 renderCoverage() called with ${hexagons.length} hexagons`);
  coverageLayer.clearLayers();
  coverageLayer.addTo(map);

  const avgCounts = [];
  const stabilityScores = [];
  const weightedScores = [];

  hexagons.forEach(h3Index => {
    const boundary = h3.cellToBoundary(h3Index, true);
    const latlngs = boundary.map(([lat, lng]) => [lat, lng]);

    const avgCount = coverageMap.get(h3Index) || 0;
    const stability = coverageStability?.get(h3Index) ?? 1;
    const weightedScore = avgCount * stability;

    avgCounts.push(avgCount);
    stabilityScores.push(stability);
    weightedScores.push(weightedScore);

    const color = limitSatellites
      ? getPreviewCoverageColor(weightedScore)
      : getCoverageColor(weightedScore);

    L.polygon(latlngs, {
      color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.6
    }).addTo(coverageLayer);
  });

  // 📊 Utility function for stats
  function logStats(label, values, decimals = 2) {
    if (!values.length) {
      console.warn(`⚠️ No ${label.toLowerCase()} data to analyze.`);
      return;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const mean = sum / sorted.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    const modeMap = new Map();
    let mode = sorted[0], maxFreq = 0;
    sorted.forEach(val => {
      const freq = (modeMap.get(val) || 0) + 1;
      modeMap.set(val, freq);
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = val;
      }
    });

    console.log(`📊 ${label} Stats:`);
    console.log(`• Min: ${min.toFixed(decimals)}`);
    console.log(`• Max: ${max.toFixed(decimals)}`);
    console.log(`• Mean: ${mean.toFixed(decimals)}`);
    console.log(`• Median: ${median.toFixed(decimals)}`);
    console.log(`• Mode: ${mode.toFixed(decimals)} (appears ${maxFreq} times)`);
  }

  logStats("Coverage (24-hour average)", avgCounts);
  logStats("Stability Score", stabilityScores, 4);
  logStats("Weighted Stability Score", weightedScores);
}

function exportCoverageData(coverageMap, coverageStability) {
  const exportData = {
    coverageMap: Object.fromEntries(coverageMap),
    coverageStability: Object.fromEntries(coverageStability)
  };

  const json = JSON.stringify(exportData, null, 2); // pretty-print for readability
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "coverage_data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("📁 coverage_data.json downloaded");
}


// Helper: Haversine distance in km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Full satellite mode
function getCoverageColor(count) {
  if (count >= 3.8) return '#800000'; // dark red
  if (count >= 3.2) return 'red';
  if (count >= 2.4) return 'orange';
  if (count >= 1.6) return 'yellow';
  if (count >= .8) return 'green';
  return 'blue';
}

function getStabilityColor(score) {
  if (score >= 0.95) return '#004d00'; // dark green (very stable)
  if (score >= 0.85) return 'green';
  if (score >= 0.70) return 'yellowgreen';
  if (score >= 0.50) return 'gold';
  if (score >= 0.30) return 'orange';
  return 'red'; // unstable
}


// Limited satellite preview mode
function getPreviewCoverageColor(count) {
  if (count >= 5) return '#800000'; // dark red
  if (count >= 4) return 'red';
  if (count >= 3) return 'orange';
  if (count >= 2) return 'yellow';
  if (count >= 1) return 'green';
  return 'blue';
}
