/* eslint-disable */

// Add an event listener that waits for the entire HTML document to be loaded
document.addEventListener('DOMContentLoaded', () => {
  const mapBox = document.getElementById('map');

  if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);

    // Create the map and set the initial view.
    // NOTE: We no longer need a default .setView() because .fitBounds() will handle it.
    const map = L.map('map', { scrollWheelZoom: false });

    // Add the tile layer (the map images) from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create an array of coordinates for the map to bound
    const points = [];

    locations.forEach(loc => {
      // Add coordinates to the points array
      // Leaflet uses [lat, lng], but GeoJSON is [lng, lat], so we reverse them.
      const reversedCoords = loc.coordinates.slice().reverse();
      points.push(reversedCoords);

      // Add a marker for each location
      L.marker(reversedCoords)
        .addTo(map)
        .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
        .openPopup();
    });

    // Set the map bounds to fit all markers
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, {
      padding: [70, 70] // Add some padding around the markers
    });
  }
});