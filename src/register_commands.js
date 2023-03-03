// require('dotenv').config();
import dotenv  from "dotenv"
dotenv.config()
import { REST, Routes } from 'discord.js';
// const { REST, Routes } = require('discord.js')

export const commands = [
    // AIDE
    {
        name: 'help',
        description: '🤖 Afficher toutes les fonctionnalités du BOT INFLUENCE.'
    },
    // BABY-FOOT
    {
        name: 'new',
        description: '⚽️ Créer une partie de baby-foot. (Si une partie existe déjà, elle sera supprimée.)'
    },
    {
        name: 'join',
        description: '⚽️ Rejoindre la partie de baby-foot.'
    },
    {
        name: 'start',
        description: '⚽️ Lancer la partie de baby-foot. (Une fois lancée, la partie sera supprimée.)'
    },
    {
        name: 'leave',
        description: '⚽️ Quitter la partie de baby-foot.'
    },
    {
        name: 'duel',
        description: 'Provoque quelqu\'un en duel !',
        options: [
            {
                name: 'cible',
                description: 'Le nom de la personne que tu souhaites défier.',
                type: ApplicationCommandOptionType.User,
                required: true
            },
        ]
    },
    {
        name: 'accept',
        description: 'Pour accepter le duel',
        required: false
    },
    {
        name: 'refuse',
        description: 'Pour refuser le duel',
        required: false
    },
    // ECOUTEURS
    {
        name: 'headset',
        description: '🎧 Vous déplace dans le rôle 🎧Écouteurs. Si vous êtes déjà dans ce rôle, vous en retire.'
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering Slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )

        console.log('Slash commands were registered successfully!');
    } catch (err) {
        console.error('There was an error : ' + err)
    }
})()