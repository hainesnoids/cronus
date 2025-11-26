const fs = require('node:fs').promises;
const path = require('node:path');

module.exports = {
    data: {
        'endpoint': '/api/buslocation'
    },
    execute: function(app) {
        function findKeyByValue(value, obj) {
            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    if (obj[key].includes(value)) {
                        return {
                            'position': key,
                            'offset': obj[key].indexOf(value)
                        };
                    }
                }
            }
            return null
        }
        app.get('/api/buslocation', async (req, res) => {
            res.json({'error': 'You must provide a bus number.'});
        });
        app.get('/api/buslocation/:num', async (req, res) => {
            const busnumber = req.params['num'];
            const buses = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'resources', 'buses.json'), { encoding: 'utf8' }));
            const busLocation = findKeyByValue(busnumber, buses);
            if (busLocation) {
                res.json({'location': busLocation});
            } else {
                res.json({'error': 'Bus location could not be found.'});
            }
        });
    }
}