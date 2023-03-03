// require('dotenv').config();
import dotenv from "dotenv"
import { commands } from './register_commands.js';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config()

// const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});




// Affiche un message dans le terminal quand le bot est bien en ligne.
client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`)
});

// BABY-FOOT VARS
let players = [];

client.on('interactionCreate', (interraction) => {
    if (!interraction.isChatInputCommand()) return;

    // AIDE
    if (interraction.commandName === 'help') {
        let commandsList = '';
        commands.forEach((element, index) => commandsList += '**/' + element.name + '** : ' + element.description + (index != commands.length - 1 ? '\n' : ''));
        interraction.reply({ content: `👋 Hello ! Je suis BOT INFLUENCE, le bot officiel de DEV INFLUENCE.\n\nJe sais faire plein de choses, voici la liste de ce que je sais faire :\n${commandsList}\n\nSi tu as des questions, demandes à tes collègues 😉`, ephemeral: true })
    }

    // BABY-FOOT
    if (interraction.commandName === 'new') {
        players = [];
        players.push(interraction.member);
        interraction.reply(`⚽️ Qui est chaud pour faire un match ? \nJoueurs : ${players} (/join pour rejoindre)`)
    }

    if (interraction.commandName === 'join') {
        players.push(interraction.member);
        interraction.reply(`✋ Je suis chaud ! \nJoueurs : ${players} (/join pour rejoindre)`)
    }

    if (interraction.commandName === 'go') {
        interraction.reply(`✋ On y va ! \nVoici les équipes : \n🔴 ${players}\n🔵 ${players}`)
    }

    if (interraction.commandName === 'leave') {
        const index = players.indexOf(interraction.member);
        const x = players.splice(index, 1);
        interraction.reply(`😕 Finalement ce sera sans moi... \nJoueurs : ${players} (/join pour rejoindre)`)
    }

    // ECOUTEURS
    if (interraction.commandName === 'headset') {
        if (!headset) {
            interraction.member.roles.add(['1079837778440896653'], `${interraction.user.username} a mis ses écouteurs.`);
            interraction.reply({ content: '📢 J\'indique aux autres que tu as mis tes écouteurs ! ', ephemeral: true })
            console.log(interraction);
            headset = true;
        } else {
            interraction.member.roles.remove(['1079837778440896653'], `${interraction.user.username} a retiré ses écouteurs.`);
            interraction.reply({ content: '📢 J\'indique aux autres que tu as retiré tes écouteurs !', ephemeral: true });
            headset = false;
        }
    }
});



client.login(process.env.TOKEN);