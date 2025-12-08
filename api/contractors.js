const fs = require('node:fs').promises;
const path = require('node:path');

module.exports = {
    data: {
        'endpoint': '/api/contractor/#num'
    },
    execute: function(app) {
        app.get('/api/contractor/:num', async (req, res) => {
            const busnumber = Number(req.params['num']);
            const buses = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'resources', 'contractors.json'), { encoding: 'utf8' }));
            const busLocation = buses[busnumber - 1];
            if (busLocation) {
                res.json({'location': busLocation});
            } else {
                res.json({'error': 'Bus location could not be found.'});
            }
        });
    }
}