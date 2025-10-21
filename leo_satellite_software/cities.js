// cities.js

const cities = [
    { name: "Addis Ababa", lat: 9.03, lon: 38.74 },
    { name: "Dire Dawa", lat: 9.59, lon: 41.86 },
    { name: "Mekelle", lat: 13.49, lon: 39.47 },
    { name: "Bahir Dar", lat: 11.59, lon: 37.39 },
    { name: "Gondar", lat: 12.6, lon: 37.47 }
  ];
  
  // Function to add city markers to the map
  function addCityMarkers(map) {
    cities.forEach(city => {
      L.marker([city.lat, city.lon]).addTo(map)
        .bindPopup(`<b>${city.name}</b>`);
    });
  }
  