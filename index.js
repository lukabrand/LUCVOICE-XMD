require('dotenv').config();
const fs = require('fs');
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');

// Ensure session folder exists
const sessionFolder = './session';
if (!fs.existsSync(sessionFolder)) {
    fs.mkdirSync(sessionFolder, { recursive: true });
    console.log('Session folder created successfully!');
}

// Use single file auth state
const sessionFile = './session/session.json';
const { state, saveState } = useSingleFileAuthState(sessionFile);

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    
    const client = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true // QR code in terminal
    });

    // Auto save session updates
    client.ev.on('creds.update', saveState);

    // Example listener: log incoming messages
    client.ev.on('messages.upsert', (m) => {
        console.log('New message received:', m);
    });

    console.log(`${process.env.BOT_NAME || 'Bot'} imeanzishwa vizuri!`);
}

// Start the bot
startBot();
