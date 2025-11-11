const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const app = express();
const PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => { console.log('Server Online, Loading API Endpoints') });

// load api endpoints
const foldersPath = path.join(__dirname, 'api');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('execute' in command) {
            command.execute(app);
            console.log(`Loaded Endpoint ${filePath}`)
        } else {
            console.log("\x1b[33m!\x1b[0m " + `The endpoint at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

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

async function main() {
    let sheetData = await getSheet(`https://docs.google.com/spreadsheets/d/${dataSheet}/export?format=csv`);
    const busData = parseBuses(sheetData);
    console.log(busData);
}
main();