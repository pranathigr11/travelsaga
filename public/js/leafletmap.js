/* eslint-disable */
const mapBox = document.getElementById('map');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  // 1. Create the map and set the initial view
  const map = L.map('map', { scrollWheelZoom: false }).setView([34.111745, -118.113491], 10);

  // 2. Add the tile layer (the map images) from OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // 3. Create an array of coordinates for the map to bound
  const points = [];

  locations.forEach(loc => {
    // Add coordinates to the points array
    points.push(loc.coordinates.slice().reverse()); // Leaflet uses [lat, lng], our data is [lng, lat]

    // Add a marker for each location
    L.marker(loc.coordinates.slice().reverse())
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
      .openPopup();
  });

  // 4. Set the map bounds to fit all markers
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, {
    padding: [70, 70] // Add some padding around the markers
  });
}