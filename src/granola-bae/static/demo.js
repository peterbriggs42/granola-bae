BASECOORDS = [41.9149395, -87.6342005];

function makeMap() {
    var TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    mymap = L.map('llmap').setView(BASECOORDS, 8);
    L.tileLayer(TILE_URL, {attribution: MB_ATTR}).addTo(mymap);
}

var layer = L.layerGroup();

function renderMarkets() {
    $.getJSON("/markets", function(obj) {
        var markers = obj.data.map(function(market) {
            var content = `${market['name']}<br/><a href=\"${market['id']}/edit\" >Edit</a>`;
            var m = L.marker([market['latitude'], market['longitude']]).bindPopup(content);
            m.marketId = market['id'];
            return m;
        });
        layer = L.layerGroup(markers);
        mymap.addLayer(layer);
    });
}

// TODO figure out how to nav without page reload -- do we need a single page framework
// function markerOnClick(e) {
//     console.log(e);
//     window.location.href = `/${e.target.marketId}/edit`;
// }

$(function() {
    makeMap();
    renderMarkets();
})
