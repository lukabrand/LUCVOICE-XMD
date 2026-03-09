const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
require("dotenv").config({ path: "./config.env" });

const BOT_NAME = process.env.BOT_NAME || "LUCVOICE-XMD";
const OWNER_NAME = process.env.OWNER_NAME || "lucvoice";
const PREFIX = process.env.PREFIX || ".";
const START_MESSAGE = process.env.START_MESSAGE || "Bot started successfully";

async function startLucvoice() {

const { state, saveCreds } = await useMultiFileAuthState("session");
const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: true,
auth: state,
version
});

console.log(`
╔══════════════════════════╗
     ${BOT_NAME} STARTED
╚══════════════════════════╝
Owner : ${OWNER_NAME}
Prefix : ${PREFIX}
`);

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update;

if(connection === "close") {
const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;

if(shouldReconnect) {
startLucvoice();
}
}

else if(connection === "open") {
console.log("✅ Bot connected to WhatsApp");
}
});

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0];
if(!msg.message) return;

const messageType = Object.keys(msg.message)[0];
const body =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
"";

const from = msg.key.remoteJid;

if(!body.startsWith(PREFIX)) return;

const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();

switch(command) {

case "ping":
await sock.sendMessage(from, { text: "🏓 Pong! Bot is alive." });
break;

case "menu":
await sock.sendMessage(from, {
text: `
╭───〔 ${BOT_NAME} MENU 〕
│
│ ${PREFIX}ping
│ ${PREFIX}menu
│
╰─────────────
`
});
break;

}

});

}

startLucvoice();
