const fs = require('node:fs').promises;
const path = require('node:path');

module.exports = {
    data: {
        'endpoint': '/api/contractor'
    },
    execute: function(app) {
        async function parseSheet() {
            const dataSheet = '14zOieQOG_ipdBEOQWX5xSkCiU_zVE_xrgof5De-PWms';

            function getSheet(url) {
                return new Promise(function (resolve, reject) {
                    fetch(url).then(response => {
                        if (!response.ok) {reject('Could not find Google Sheet with that URL')} // Checking for a 404
                        else {
                            response.text().then(data => {
                                if (!data) {reject('Invalid data pulled from sheet')}
                                resolve(data);
                            })
                        }
                    })
                })
            }

            function parseBuses(csv) {
                function csvToArrays() {
                    let table = [];
                    csv.split('\n').forEach((line) => {
                        let row = [];
                        line.split(',').forEach((cell) => {
                            row.push(cell);
                        })
                        table.push(row);
                    })
                    return table;
                }
                let table = csvToArrays();
                let resultingTable = [];
                for (let i = 2; i < 101; i++) {
                    resultingTable.push(table[i][2]);
                }
                
                return resultingTable;
            }

            let sheetData = await getSheet(`https://docs.google.com/spreadsheets/d/${dataSheet}/export?format=csv`);
            const content = JSON.stringify(parseBuses(sheetData));
            await fs.writeFile(path.join(__dirname, '..', 'resources', 'contractors.json'), content)
        }
        setInterval(parseSheet, 60);
        parseSheet().then();
        app.get('/api/contractor', async (req, res) => {
            const file = await fs.readFile(path.join(__dirname, '..', 'resources', 'contractors.json'), { encoding: 'utf8' });
            res.json(JSON.parse(file));
        });
    }
}