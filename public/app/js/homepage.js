let busRefreshInterval;
async function renderBuses() {
    const config = JSON.parse(localStorage.getItem('config'));
    if (config['autoupdate']) {
        homePageAutoUpdate().then();
    }
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
    const observerOptions = { attributes: true };
    const homePage = document.querySelector('page#home');
    let docuPageMutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            console.log(mutation.type, mutation.target.id, mutation.attributeName);
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && !String(mutation.target.className).includes('active')) { // we love pagination api not coming with built-in events
                busRefreshInterval = null;
                disconnectObserver();
            }
        });
    });
    function disconnectObserver() {
        docuPageMutationObserver.disconnect();
    }
    docuPageMutationObserver.observe(homePage);
}

document.addEventListener('DOMContentLoaded',renderBuses);
document.addEventListener('DOMContentLoaded',getContractorNumber);