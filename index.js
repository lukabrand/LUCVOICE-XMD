require('dotenv').config({ path: './config.env' });
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const chalk = require('chalk');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize WhatsApp client with LocalAuth
const client = new Client({
    authStrategy: new LocalAuth({ clientId: process.env.BOT_NAME }),
    puppeteer: { headless: true }
});

// ===============================
// QR Code Handling
// ===============================
client.on('qr', (qr) => {
    console.log(chalk.yellow(`[${moment().format('HH:mm:ss')}] Scan QR Code to connect WhatsApp:`));
    qrcode.generate(qr, { small: true });
});

// ===============================
// Bot Ready
// ===============================
client.on('ready', () => {
    console.log(chalk.green(`[${moment().format('HH:mm:ss')}] ${process.env.BOT_NAME} is ready! ✅`));
});

// ===============================
// Auto Reconnect on Disconnect
// ===============================
client.on('disconnected', (reason) => {
    console.log(chalk.red(`[${moment().format('HH:mm:ss')}] Disconnected: ${reason}`));
    console.log(chalk.blue('Reconnecting...'));
    client.initialize();
});

// ===============================
// Message Handler
// ===============================
client.on('message', async (msg) => {
    const chat = await msg.getChat();
    console.log(chalk.cyan(`[${chat.name || chat.id.user}] ${msg.body}`));

    // Example auto-reply commands
    const prefix = process.env.PREFIX || '.';
    if (msg.body.toLowerCase() === 'hello') {
        msg.reply(`Hello! I am ${process.env.BOT_NAME} 🤖`);
    }

    if (msg.body.startsWith(`${prefix}ping`)) {
        msg.reply('Pong! 🏓');
    }

    if (msg.body.startsWith(`${prefix}owner`)) {
        msg.reply(`Owner: ${process.env.OWNER_NAME}\nContact: ${process.env.OWNER_NUMBER}`);
    }
});

// ===============================
// Initialize client
// ===============================
client.initialize();

// ===============================
// Express Server for Session Page
// ===============================
app.get('/', (req, res) => {
    res.send(`
        <h2>${process.env.BOT_NAME} is running ✅</h2>
        <p>Owner: ${process.env.OWNER_NAME}</p>
        <p>Prefix: ${process.env.PREFIX}</p>
        <img src="${process.env.IMAGE_MENU}" width="300"/>
    `);
});

app.listen(PORT, () => {
    console.log(chalk.magenta(`[${moment().format('HH:mm:ss')}] Express server running on port ${PORT}`));
});
