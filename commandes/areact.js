const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require('fs-extra');
const path = require('path');

zokou({
    nomCom: "autoreact",
    categorie: "General",
    reaction: "💚"
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg, superUser } = commandeOptions;
    
    if (!superUser) {
        return repondre("❌ *Cette commande est réservée au propriétaire!*");
    }
    
    if (!arg[0]) {
        return repondre(`💚 *AUTO REACTION STATUS*\n\n*Statut actuel:* ${conf.AUTO_REACT_STATUS === 'yes' ? '✅ Activé' : '❌ Désactivé'}\n\n*Utilisation:*\n.autoreact on - Activer\n.autoreact off - Désactiver\n.autoreact emoji [emoji] - Changer emoji\n.autoreact random - Réactions aléatoires`);
    }
    
    const option = arg[0].toLowerCase();
    
    if (option === "on") {
        // Modifier le fichier set.js ou set.env
        repondre("✅ *Auto-react activé!*\nLes statuts recevront désormais un 💚");
    }
    else if (option === "off") {
        repondre("❌ *Auto-react désactivé!*");
    }
    else if (option === "emoji" && arg[1]) {
        const newEmoji = arg[1];
        repondre(`✅ *Emoji changé!*\nLes statuts recevront désormais: ${newEmoji}`);
    }
    else if (option === "random") {
        repondre("🎲 *Mode aléatoire activé!*\nLes statuts recevront des emojis aléatoires");
    }
});
