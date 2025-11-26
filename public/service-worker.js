setTimeout(() => {
    self.registration.showNotification('Test notification please ignore.');
}, 2000);
self.addEventListener('message', (event) => {
    let body = event.data;
    switch (body.type) {
        case 'notification': {
            self.registration.showNotification(body.title, body.options);
        }
    }
});