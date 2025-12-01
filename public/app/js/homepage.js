async function renderBuses() {
    let allBuses = await fetch('/api/buses')
        .then(res => res.json());
    console.log(allBuses);
    if (allBuses) {
        Object.entries(allBuses).forEach(([key, value]) => {
            for (let i = 0; i < value.length; i++) {
                document.querySelector(`bus[position="${key}"][offset="${i}"]`).innerHTML = value[i];
            }
        });
    }
    let busNumber = JSON.parse(localStorage.getItem('config'))['busnumber'];
    if (busNumber) {
        let busLocation = await fetch(`/api/buslocation/${busNumber}`)
            .then(res => res.json())
            .then(d => d.location);
        console.log(busLocation);
        const focusedBus = document.querySelector(`bus[position="${busLocation.position}"][offset="${busLocation.offset}"]`);
        focusedBus.setAttribute('highlight', 'true');
        focusedBus.scrollIntoView({ 'block': 'center', 'behavior': 'smooth', 'container': 'nearest' });
        document.querySelector('.bus-location-header').innerText = `Your bus is the ${busLocation.offset} bus in section ${busLocation.position}`;
    }
}

document.addEventListener('DOMContentLoaded',renderBuses);