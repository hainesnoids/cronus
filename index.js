const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const app = express();
const PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => { console.log('Server Online, Loading API Endpoints') });

// load api endpoints
const commandsPath = path.join(__dirname, 'api');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' && 'execute' in command) {
        command.execute(app);
        console.log(`Loaded Endpoint ${command.data.endpoint}`)
    } else {
        console.log("\x1b[33m!\x1b[0m " + `The endpoint at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

process.on('uncaughtException', () => {/* do jack shit */}) // my iconic anti-crash one-liner