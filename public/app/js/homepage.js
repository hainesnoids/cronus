let busRefreshInterval;
DocuPager.addEventListener('page-switch', (e) => {
    const config = JSON.parse(localStorage.getItem('config'));
    if (e.detail.targetPage === 'home') {
        renderBuses().then();
        getContractorNumber().then();
    }
    if (config['autoupdate']) {
        homePageAutoUpdate().then();
    }
})
async function renderBuses() {
    const config = JSON.parse(localStorage.getItem('config'));
    let allBuses = await fetch('/api/buses')
        .then(res => res.json());
    if (allBuses) {
        Object.entries(allBuses).forEach(([key, value]) => {
            for (let i = 0; i < value.length; i++) {
                document.querySelector(`bus[position="${key}"][offset="${i}"]`).innerHTML = value[i];
            }
        });
    }
    let busNumber = config['busnumber'];
    if (busNumber) {
        let busLocation = await fetch(`/api/buslocation/${busNumber}`)
            .then(res => res.json())
            .then(d => d.location);
        const focusedBus = document.querySelector(`bus[position="${busLocation.position}"][offset="${busLocation.offset}"]`);
        focusedBus.setAttribute('highlight', 'true');
        focusedBus.scrollIntoView({ 'block': 'center', 'behavior': 'smooth', 'container': 'nearest' });
        document.querySelector('.bus-location-header').innerText = `Your bus is the ${busLocation.offset} bus in section ${busLocation.position}`;
    }
}
async function getContractorNumber() {
    let busNumber = JSON.parse(localStorage.getItem('config'))['busnumber'];
    let busContractor = await fetch(`/api/contractor/${busNumber}`)
        .then(res => res.json())
        .then(d => d.location);
    if (busContractor) {
        const [ contractor, contractorNumber ] = busContractor.split('-');
        document.querySelector('.finder-contractor').src = `img/contractor-logos/${contractor}.svg`;
        document.querySelector('.finder-number').innerHTML = contractorNumber;
    }
}

async function homePageAutoUpdate() {
    busRefreshInterval = setInterval(renderBuses, 30000);
    DocuPager.addEventListener('page-switch', (e) => {
        if (e.targetPage !== 'home') {
            clearInterval(busRefreshInterval);
        }
    });
}

document.addEventListener('DOMContentLoaded',renderBuses);
document.addEventListener('DOMContentLoaded',getContractorNumber);