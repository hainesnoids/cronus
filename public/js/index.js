window.version = [ 0, 1, 0 ];
function print(text) {
    document.querySelector('#console').innerHTML += `<span>${text}</span><br>`
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#a').addEventListener('click', () => {
        Notification.requestPermission();
    })
    document.querySelector('#b').addEventListener('click', () => {
        try {
            new Notification('Your bus is near the front of the building', { body: 'Leave through the D-Hall Exit' });
        } catch(e) {
            print(e);
        } finally {
            print('Notified');
        }
    })
    document.querySelector('#c').addEventListener('click', () => {
        navigator.serviceWorker.controller.postMessage({
            'type': 'notification',
            'title': 'Your bus is near the front of the building',
            'options': { body: 'Leave through the D-Hall Exit' }
        });
    })
    document.querySelector('#d').addEventListener('click', () => {
        try {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                    .register('service-worker.js')
                    .then((registration) => {
                        registration.addEventListener("updatefound", () => {
                            // If updatefound is fired, it means that there's
                            // a new service worker being installed.
                            const installingWorker = registration.installing;
                            print(
                                "A new service worker is being installed:",
                                installingWorker,
                            );

                            // You can listen for changes to the installing service worker's
                            // state via installingWorker.onstatechange
                        });
                    })
                    .catch((error) => {
                        print(`Service worker registration failed: ${error}`);
                    });
            }
        } catch(e) {
            print(e);
        }
    })
    document.querySelector('#e').addEventListener('click', () => {
        print(localStorage.getItem('config'));
    })
    document.querySelector('#f').addEventListener('click', () => {
        print(localStorage.setItem('config', '{}'));
    })
})

function offLine() {
    document.querySelector('offline').style.display = 'flex';
}

function onLine() {
    document.querySelector('offline').style.display = 'none';
}

window.addEventListener('offline',offLine);
window.addEventListener('online',onLine);

function pageInit() {
    const pageBounds = document.querySelector("pagebounds");
    const pages = document.querySelectorAll('pagebounds > page');
    for (let idx = 0; idx < pages.length; idx++) {
        let page = pages[idx];
        const pageId = page.getAttribute('id');
        const pageLink = document.querySelector(`button[data-page-id="${pageId}"]`);
        if (pageLink) {
            pageLink.addEventListener('click', () => {
                pages.forEach((p) => {p.classList.remove('active')});
                page.classList.add('active');
                document.querySelector('.selected[data-page-id]').classList.remove('selected');
                pageLink.classList.add('selected');
                //pageBounds.style.left = `-${idx}00%`;
                window.scrollTo({behavior: 'smooth', top: 0});
            })
        } else {
            console.warn(`Page ${pageId} does not have a corresponding link to it.`);
        }
    }
}