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
const sides = ['🔴', '🔵']
const shuffledSides = sides.sort((a, b) => 0.5 - Math.random());
let gameOn = false;

const duels = []

client.on('interactionCreate', (interraction) => {
    if (!interraction.isChatInputCommand()) return;

    // AIDE
    if (interraction.commandName === 'help') {
        let commandsList = '';
        commands.forEach((element, index) => commandsList += '**/' + element.name + '** : ' + element.description + (index != commands.length - 1 ? '\n' : ''));
        interraction.reply({ content: `👋 Hello ! Je suis BOT INFLUENCE, le bot officiel de DEV INFLUENCE.\n\nJe sais faire plein de choses, voici la liste de tout ce que je sais faire :\n${commandsList}\n\nSi tu as des questions, demandes à tes collègues 😉`, ephemeral: true })
    }

    // BABY-FOOT
    if (interraction.commandName === 'new') {
        if (!gameOn) {
            players = [];
            players.push(interraction.member);
            interraction.reply(`⚽️ Qui est chaud pour faire un match ? \nJoueurs : ${players} (/join pour rejoindre)`)
            gameOn = !gameOn;
        } else {
            interraction.reply({ content: `🤕 Oups, une partie est déjà en cours de préparation, rejoins-la (/join) et montre leurs de quoi tu es capable !`, ephemeral: true })

        }
    }

    if (interraction.commandName === 'join') {
        const index = players.indexOf(interraction.member);

        if (players.length == 0) {
            interraction.reply({ content: `🤕 Il n'y a aucune partie en cours, crées-en une avec /new !`, ephemeral: true })
        } else if (index != -1) {
            interraction.reply({ content: `🤕 Tu es déjà compté dans les participant de la partie !`, ephemeral: true })
        } else if (players.length == 3) {
            players.push(interraction.member);
            const shuffledPlayers = players.sort((a, b) => 0.5 - Math.random());
            interraction.reply(`👍 On y va ! \nVoici les équipes : \n${shuffledSides[0]} ${shuffledPlayers[0]} ${shuffledPlayers[1]}\n${shuffledSides[1]} ${shuffledPlayers[2]} ${shuffledPlayers[3]}`)
            players = [];
        } else {
            players.push(interraction.member);
            interraction.reply(`🔥 ${interraction.member} est chaud ! \nJoueurs : ${players} (/join pour rejoindre)`)
        }

    }

    if (interraction.commandName === 'start') {
        const shuffledPlayers = players.sort((a, b) => 0.5 - Math.random());
        if (players.length == 1) {
            interraction.reply({ content: `🤕 Désolé, tu ne peux pas lancer une partie si tu es tout seul, même si tu as un talent exceptionnel pour jouer avec tes deux pieds et tes deux mains en même temps !`, ephemeral: true })
        } else if (players.length == 2) {
            interraction.reply(`👍 On y va ! \nVoici les challengers : \n${shuffledSides[0]} ${shuffledPlayers[0]}\n${shuffledSides[1]} ${shuffledPlayers[1]}`)
            players = [];
        } else if (players.length == 3) {
            interraction.reply(`👍 On y va ! \nVoici les équipes : \n${shuffledSides[0]} ${shuffledPlayers[0]}\n${shuffledSides[1]} ${shuffledPlayers[1]} ${shuffledPlayers[2]}`)
            players = [];
        } else if (players.length == 4) {
            interraction.reply(`👍 On y va ! \nVoici les équipes : \n${shuffledSides[0]} ${shuffledPlayers[0]} ${shuffledPlayers[1]}\n${shuffledSides[1]} ${shuffledPlayers[2]} ${shuffledPlayers[3]}`)
            players = [];
        }
    }

    if (interraction.commandName === 'leave') {
        const index = players.indexOf(elem => elem.Discriminator == interraction.member.Discriminator);

        if (index == -1) {
            interraction.reply({ content: `🤕 Tu ne peux pas quitter une partie dans laquelle tu n'es pas. Rejoins-en une puis quitte la ensuite.`, ephemeral: true })
        } else {
            interraction.reply(`😕 ${interraction.member} se dégonfle finalement, une place se libère... \nJoueurs : ${players} (/join pour rejoindre)`)
            players.splice(index, 1);
        }
    }
    if (interraction.commandName === 'duel') {
        const target = interraction.options.getUser('cible');
        const isInDuelSender = duels.find(elem => elem.target.Discriminator == interraction.member.Discriminator || elem.sender.Discriminator == interraction.member.Discriminator);
        const isInDuelTarget = duels.find(elem => elem.target.Discriminator == target.Discriminator || elem.sender.Discriminator == target.Discriminator);
        if (target.id == interraction.member.id) {
            interraction.reply({ content: `🤕 Désolé, tu ne peux pas te provoquer en duel tout seul, même si tu as un talent exceptionnel pour jouer avec tes deux pieds et tes deux mains en même temps !`, ephemeral: true })
        } else if (isInDuelSender || isInDuelTarget) {
            interraction.reply({ content: `🤕 Toi ou ta cible êtes déjà provoqué en duel...`, ephemeral: true })
        } else if (target.username == 'BOT INFLUENCE') {
            interraction.reply({ content: `🤕 Je ne suis qu'un bot, je ne peux pas jouer au baby-foot...`, ephemeral: true })
        } else {
            duels.push({ sender: interraction.member, target: target });
            interraction.reply(`:crossed_swords: ${interraction.member} décide de provoquer ${target} en duel ! Va-t-il accepter ?`)
        }


    }
    if (interraction.commandName === 'accept') {
        var result = duels.find(obj => {
            return obj.target.Discriminator === interraction.member.Discriminator;
        })
        if (result) {
            if (result.sender.user.id != interraction.member.id) {
                const shuffledSides = sides.sort((a, b) => 0.5 - Math.random());
                interraction.reply(`✅ ${interraction.member} accepte le duel contre ${result.sender} ! \nQue le/la meilleur(e) gagne !\n${shuffledSides[0]} ${interraction.member}\n${shuffledSides[1]} ${result.sender}`)
                const index = duels.indexOf(elem => elem.target.Discriminator == interraction.member.Discriminator);
                duels.splice(index, 1);

            } else {
                interraction.reply({ content: `🤕 Personne ne t'a provoqué en duel, peut-être ont-ils peur de toi ?`, ephemeral: true })
            }
        } else {
            interraction.reply({ content: `🤕 Personne ne t'a provoqué en duel, peut-être ont-ils peur de toi ?`, ephemeral: true })
        }
    }
    if (interraction.commandName === 'refuse') {
        var result = duels.find(obj => {
            return obj.target.Discriminator === interraction.member.Discriminator;
        })
        if (result) {
            if (result.sender.user.id != interraction.member.id) {
                interraction.reply(`❌ ${interraction.member} refuse le duel contre ${result.sender} !\nIl/Elle a peut-être une peur irrationnelle des petites balles en plastique et des joueurs en bois qui le regardent avec leurs yeux noirs effrayants ! Ou peut-être qu'il/elle a peur de perdre et devoir faire la vaisselle pour le reste de la semaine...`)
                const index = duels.indexOf(elem => elem.target.Discriminator == interraction.member.Discriminator);
                duels.splice(index, 1);

            } else {
                interraction.reply({ content: `🤕 Personne ne t'a provoqué en duel, peut-être ont-ils peur de toi ?`, ephemeral: true })
            }
        } else {
            interraction.reply({ content: `🤕 Personne ne t'a provoqué en duel, peut-être ont-ils peur de toi ?`, ephemeral: true })
        }
    }

    // ECOUTEURS
    if (interraction.commandName === 'headset') {
        if (!interraction.member.roles.cache.has('1079837778440896653')) {
            interraction.member.roles.add(['1079837778440896653'], `${interraction.user.username} a mis ses écouteurs.`);
            interraction.reply({ content: '🔈 J\'indique aux autres que tu as mis tes écouteurs ! ', ephemeral: true })
        } else {
            interraction.member.roles.remove(['1079837778440896653'], `${interraction.user.username} a retiré ses écouteurs.`);
            interraction.reply({ content: '🔇 J\'indique aux autres que tu as retiré tes écouteurs !', ephemeral: true });
        }
    }
});



client.login(process.env.TOKEN);