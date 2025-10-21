function tileRegion(map, geojsonUrl) {
  const regionName = geojsonUrl.split("/").pop().replace(".geojson", "");
  return fetch(geojsonUrl)
    .then(response => {
      console.log(`✅ GeoJSON file fetched from ${geojsonUrl}`);
      return response.json();
    })
    .then(data => {
      console.log("✅ GeoJSON parsed:", data);

      const resolution = 5;
      let hexagons = [];

      if (!data.features || data.features.length === 0) {
        console.error("❌ No features found in GeoJSON");
        return [];
      }

      function extractHexes(data, flipCoords = false) {
        let hexes = [];

        data.features.forEach((feature, featureIndex) => {
          const geometry = feature.geometry;

          if (!geometry || !geometry.coordinates) {
            console.warn(`⚠️ Skipping feature ${featureIndex}: missing geometry`);
            return;
          }

          const polygons = geometry.type === "Polygon"
            ? [geometry.coordinates]
            : geometry.type === "MultiPolygon"
              ? geometry.coordinates
              : [];

          if (polygons.length === 0) {
            console.warn(`⚠️ Skipping feature ${featureIndex}: unsupported geometry type ${geometry.type}`);
            return;
          }

          polygons.forEach((polygon, polygonIndex) => {
            const outerRing = polygon[0];
            if (!outerRing || !Array.isArray(outerRing) || outerRing.length === 0) {
              console.error(`❌ Feature ${featureIndex} Polygon ${polygonIndex} outer ring is invalid`);
              return;
            }

            let geoBoundary = flipCoords
              ? outerRing.map(([lat, lng]) => [lng, lat])
              : [...outerRing];

            if (
              geoBoundary.length > 0 &&
              (geoBoundary[0][0] !== geoBoundary[geoBoundary.length - 1][0] ||
               geoBoundary[0][1] !== geoBoundary[geoBoundary.length - 1][1])
            ) {
              geoBoundary.push(geoBoundary[0]);
            }

            try {
              const hexesForPolygon = h3.polygonToCells(geoBoundary, resolution);
              hexes.push(...hexesForPolygon);
            } catch (err) {
              console.error(`❌ Error in Feature ${featureIndex} Polygon ${polygonIndex}:`, err);
            }
          });
        });

        return hexes;
      }

      // First attempt: assume [lng, lat]
      hexagons = extractHexes(data, false);

      // If no hexes, retry with flipped coordinates
      if (hexagons.length === 0) {
        console.warn("⚠️ No hexes found with [lng, lat] — retrying with [lat, lng]");
        hexagons = extractHexes(data, true);
      }

      hexagons.forEach(h3Index => {
        const boundary = h3.cellToBoundary(h3Index, true);
        const latlngs = boundary.map(([lat, lng]) => [lat, lng]);

        L.polygon(latlngs, {
          color: 'blue',
          weight: 2,
          fillColor: 'cyan',
          fillOpacity: 0.5
        }).addTo(map);
      });

      const allLatLngs = hexagons.flatMap(h3Index =>
        h3.cellToBoundary(h3Index, true).map(([lat, lng]) => [lat, lng])
      );

      console.log(`✅ Generated ${hexagons.length} hexagons`);
      if (hexagons.length > 0) {
        console.log("Sample hex boundary:", h3.cellToBoundary(hexagons[0], true));
      }

      if (allLatLngs.length === 0) {
        console.warn("⚠️ No valid hex boundaries to fit map");
        map.setView([0, 0], 2); // fallback view
        return hexagons;
      }

      map.fitBounds(allLatLngs);
      return { hexagons, regionName };
    })
    .catch(error => {
      console.error("❌ Fetch or processing error:", error);
      return [];
    });
}
