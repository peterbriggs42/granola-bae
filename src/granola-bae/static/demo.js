BASECOORDS = [41.9149395, -87.6342005];

function makeMap() {
    var TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    mymap = L.map('llmap').setView(BASECOORDS, 8);
    L.tileLayer(TILE_URL, {attribution: MB_ATTR}).addTo(mymap);
}

var layer = L.layerGroup();

function renderData(districtid) {
    $.getJSON("/market/" + districtid, function(obj) {
        var markers = obj.data.map(function(arr) {
            return L.marker([arr[0], arr[1]]);
        });
        mymap.removeLayer(layer);
        layer = L.layerGroup(markers);
        mymap.addLayer(layer);
    });
}

function renderMarkets() {
    $.getJSON("/markets", function(obj) {
        var markers = obj.data.map(function(arr) {
            return L.marker([arr[0], arr[1]]);
        });
        layer = L.layerGroup(markers);
        mymap.addLayer(layer);
    });
}

$(function() {
    makeMap();
    // renderData('0');
    renderMarkets();
    $('#distsel').change(function() {
        // TODO change this to switch editor to the selected market
        // var val = $('#distsel option:selected').val();
        // renderData(val);
    });
})
