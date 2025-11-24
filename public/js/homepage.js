async function renderBuses() {
    let allBuses = await fetch('/api/buses')
        .then(res => res.json());
    console.log(allBuses);
    let busNumber = JSON.parse(localStorage.getItem('config'))['busnumber'];
    if (busNumber) {
        let busLocation = await fetch(`/api/buslocation/${busNumber}`)
            .then(res => res.json())
            .then(d => d.location);
        console.log(busLocation);

        document.querySelector('.bus-location-header').innerText = `Your bus is the ${busLocation.offset} bus in section ${busLocation.position}`;
    }
}

document.addEventListener('DOMContentLoaded',renderBuses);