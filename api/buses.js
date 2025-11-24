const fs = require('node:fs').promises;
const path = require('node:path');

module.exports = {
    data: {
        'endpoint': '/api/buses'
    },
    execute: function(app) {
        async function parseSheet() {
            //const dataSheet = '1C2ggPchZMgKWcIXoDgBIF_QwNnw3QKLkP1H0lgzHCJw';
            const dataSheet = '1N0p1oCXAld32EVLG-qMs5DSnWAFJO1bDR_rkR96Hmvk';

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
                return {
                    northA: [
                        table[1][0],
                        table[2][0],
                        table[3][0],
                        table[4][0],
                        table[5][0],
                        table[6][0],
                        table[7][0],
                        table[8][0]
                    ],
                    northB: [
                        table[1][1],
                        table[2][1],
                        table[3][1],
                        table[4][1],
                        table[5][1],
                        table[6][1],
                        table[7][1],
                        table[8][1]
                    ],
                    northC: [
                        table[1][2],
                        table[2][2],
                        table[3][2],
                        table[4][2],
                        table[5][2],
                        table[6][2],
                        table[7][2],
                        table[8][2]
                    ],
                    northD: [
                        table[1][3],
                        table[2][3],
                        table[3][3],
                        table[4][3],
                        table[5][3],
                        table[6][3],
                        table[7][3],
                        table[8][3]
                    ],
                    westA: [
                        table[14][4],
                        table[15][4]
                    ],
                    westB: [
                        table[14][5],
                        table[15][5]
                    ],
                    southA: [
                        table[18][0],
                        table[18][1],
                        table[18][2],
                        table[18][3],
                        table[18][4],
                        table[18][5]
                    ],
                    southB: [
                        table[19][0],
                        table[19][1],
                        table[19][2],
                        table[19][3],
                        table[19][4],
                        table[19][5]
                    ]
                };
            }

            let sheetData = await getSheet(`https://docs.google.com/spreadsheets/d/${dataSheet}/export?format=csv`);
            const content = JSON.stringify(parseBuses(sheetData));
            await fs.writeFile(path.join(__dirname, '..', 'resources', 'buses.json'), content)
        }
        setInterval(parseSheet, 60);
        parseSheet().then();
        app.get('/api/buses', async (req, res) => {
            const file = await fs.readFile(path.join(__dirname, '..', 'resources', 'buses.json'), { encoding: 'utf8' });
            res.json(JSON.parse(file));
        });
    }
}