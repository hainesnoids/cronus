setTimeout(() => {
    self.registration.showNotification('hi');
}, 2000);
self.addEventListener('message', (event) => {
    let body = event.data;
    switch (body.type) {
        case 'notification': {
            self.registration.showNotification(body.title, body.options);
        }
    }
});