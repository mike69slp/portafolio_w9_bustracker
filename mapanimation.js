let idListBuses = null;
let idBusesContainer = null;
let idMapContainer = null;

let map = null;
let markerRed = null;
let markerBlue = null;
let marker = null;
let currentDirection = -1;
let busId = '';
let timer = null;

mapboxgl.accessToken = 'pk.eyJ1Ijoic29mdGV4cGVyaW1lbnQiLCJhIjoiY2tjMngyZm9rMDFvajJzczJ3aWo0bnh6aiJ9.Bc_qK9Xf8SFBXkFM_x2gpg';

function init() {
    idListBuses = document.getElementById("listBuses");
    idBusesContainer = document.getElementById("busesContainer");
    idMapContainer = document.getElementById("mapContainer");

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-71.104081, 42.365554],
        zoom: 12
    });

    const divRed = document.createElement('div');
    divRed.style.backgroundImage = "url('red.png')";
    divRed.style.width = '32px';
    divRed.style.height = '37px';
    divRed.style.backgroundSize = '100%';

    markerRed = new mapboxgl.Marker(divRed).setLngLat([-71.092761, 42.357575]);

    const divBlue = document.createElement('div');
    divBlue.style.backgroundImage = "url('blue.png')";
    divBlue.style.width = '32px';
    divBlue.style.height = '37px';
    divBlue.style.backgroundSize = '100%';

    markerBlue = new mapboxgl.Marker(divBlue).setLngLat([-71.092761, 42.357575]);

    idBusesContainer.style.display = "block";
    idMapContainer.style.display = "none";
}

function listBuses(){
	addBuses();
}

async function addBuses(){
    let buses = await getBuses();

	buses.forEach(function(bus){
        idListBuses.innerHTML += `<p class="item">bus id: ${bus.id} :: direction: ${bus.attributes.direction_id} :: <button onclick="showBusOnMap('${bus.id}')">Track it!</button></p>`;
	});
}

async function getBuses(){
	let url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';	
	let response = await fetch(url);
	let json     = await response.json();
	return json.data;
}

function showBusOnMap(id) {
    idBusesContainer.style.display = "none";
    idMapContainer.style.display = "block";

    busId = id;

    moveBus();
}

function showBusList() {
    idBusesContainer.style.display = "block";
    idMapContainer.style.display = "none";

    idListBuses.innerHTML = "";

    clearTimeout(timer);

    marker = null;
    currentDirection = -1;
    markerRed.remove();
    markerBlue.remove();
}

async function moveBus(){
    let buses = await getBuses();

    buses.forEach(function(bus){
		if (bus.id === busId){
            if (bus.attributes.direction_id !== currentDirection) {
                if (currentDirection === 0) {
                    markerRed.remove();
                } else if (currentDirection === 1) {
                    markerBlue.remove();
                }

                if (bus.attributes.direction_id === 0) {
                    markerRed.addTo(map);
                    marker = markerRed;
                    currentDirection = 0;
                } else if (bus.attributes.direction_id === 1) {
                    markerBlue.addTo(map);
                    marker = markerBlue;
                    currentDirection = 1;
                }
            }

            marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
            console.log("long: " + bus.attributes.longitude + " :: lat: " + bus.attributes.latitude);
		}
	});

    timer = setTimeout(moveBus,15000);
}

window.onload = init;