let map;
let mapInitialized = false;
function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;
    map = L.map('map-canvas', {
        zoomControl: false
    }).setView([39.9210, -74.8554], 16);

    const baseMarkerOptions = {
        'icon': L.icon({
            iconUrl: 'img/map/marker.svg',
            iconSize: [24, 36],
            iconAnchor: [12, 36],
            popupAnchor: [0, -18],
        }),
        'keyboard': true,
        'title': 'Marker',
        'alt': 'Marker'
    }

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([39.9210, -74.8554], baseMarkerOptions).addTo(map)
        .bindPopup('<b>Title</b><br>Subtitle')
        .openPopup();

    map.invalidateSize();

    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
}
function unloadMap() {

}

DocuPager.addEventListener('page-switch', (e) => {
    console.log('page-switch', e);
    if (e.detail.targetPage === 'routes') {
        initMap();
    } else {
        unloadMap();
    }
})