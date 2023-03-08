// require('dotenv').config();
import dotenv  from "dotenv"
dotenv.config()
import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
// const { REST, Routes } = require('discord.js')

export const commands = [
    // AIDE
    {
        name: 'help',
        description: '👋 Afficher toutes les fonctionnalités du BOT INFLUENCE.'
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
        description: '⚽️ Provoquer quelqu\'un en duel !',
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
        description: '⚽️ Accepter le duel.',
        required: false
    },
    {
        name: 'refuse',
        description: '⚽️ Refuser le duel.',
        required: false
    },
    //VOTE
    {
        name: 'vote',
        description: '✋ Créer un vote.',
        options: [
            {
                name: 'question',
                description: 'La question à poser.',
                type: ApplicationCommandOptionType.String,
                required: true
            },
        ]
    },
    // ECOUTEURS
    {
        name: 'headset',
        description: '🎧 Avertir tes collègues que tu as mis ou retiré tes écouteurs.'
    },
    // GAMELLE
    {
        name: 'gamelle',
        description: '🍔/🍲 Si tu hésites entre manger ta gamelle ou manger ailleurs.'
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