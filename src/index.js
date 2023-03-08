// require('dotenv').config();
import dotenv from "dotenv"
import { commands } from './register_commands.js';
import { Client, GatewayIntentBits, MessageEmbed } from 'discord.js';

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
const shuffledSides = sides.sort(() => 0.5 - Math.random());
let gameOn = false;

const duels = []

client.on('interactionCreate', (interraction) => {
    if (!interraction.isChatInputCommand()) return;

    // AIDE
    if (interraction.commandName === 'help') {
        let commandsList = '';
        commands.forEach((element, index) => commandsList += '**/' + element.name + '** : ' + element.description + (index != commands.length - 1 ? '\n' : ''));
        interraction.reply({ content: `👋 Hello ! Je suis BOT INFLUENCE, le bot officiel de DEV INFLUENCE.\n\nJe sais faire plein de choses, voici la liste de tout ce que je sais faire :\n\n${commandsList}\n\nSi tu as des questions, demandes à tes collègues 😉`, ephemeral: true })
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
        const shuffledPlayers = players.sort(() => 0.5 - Math.random());
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
        const index = players.indexOf(interraction.member);
        if (index == -1) {
            interraction.reply({ content: `🤕 Tu ne peux pas quitter une partie dans laquelle tu n'es pas. Rejoins-en une puis quitte la ensuite.`, ephemeral: true })
        } else if (players.length == 1) {
            interraction.reply(`😕 ${interraction.member} se dégonfle finalement, il n'y a plus personne dans la partie... (/new pour en créer une nouvelle)`)
            players = [];
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
                const shuffledSides = sides.sort(() => 0.5 - Math.random());
                interraction.reply(`✅ ${interraction.member} accepte le duel contre ${result.sender} ! \nQue le/la meilleur(e) gagne !\n${shuffledSides[0]} ${interraction.member}\n${shuffledSides[1]} ${result.sender}`)
                const index = duels.indexOf(elem => elem.target.Discriminator == interraction.member.Discriminator);
                duels.splice(index, 1);

            } else {
                interraction.reply({ content: `🤕 Tu ne peux pas accepter un duel que tu as provoqué, laisse ton adversaire choisir...`, ephemeral: true })
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
                interraction.reply(`❌ ${interraction.member} refuse le duel contre ${result.sender} !\nIl/Elle a peut-être une peur irrationnelle des petites balles ! Ou peut-être qu'il/elle a peur de perdre et devoir faire la vaisselle pour le reste de la semaine...`)
                const index = duels.indexOf(elem => elem.target.Discriminator == interraction.member.Discriminator);
                duels.splice(index, 1);

            } else {
                interraction.reply({ content: `🤕 Tu ne peux pas refuser un duel que tu as provoqué, laisse ton adversaire choisir...`, ephemeral: true })
            }
        } else {
            interraction.reply({ content: `🤕 Personne ne t'a provoqué en duel, peut-être ont-ils peur de toi ?`, ephemeral: true })
        }
    }

    // ECOUTEURS
    if (interraction.commandName === 'headset') {
        const role = client.guilds.cache.get(process.env.GUILD_ID).roles.cache.find(role => role.name === '🎧 Écouteurs');
        const hasHeadset = interraction.member.roles.cache.some(role => role.name === '🎧 Écouteurs');
        if (hasHeadset) {
            interraction.member.roles.remove(role);
            interraction.reply({ content: '🔇 J\'indique aux autres que tu as retiré tes écouteurs !', ephemeral: true });
        } else {
            interraction.member.roles.add(role);
            interraction.reply({ content: '🔈 J\'indique aux autres que tu as mis tes écouteurs ! ', ephemeral: true })
        }
    }

    //VOTE
    if (interraction.commandName === 'vote') {
        const question = interraction.options.getString('question'); // Extrait la question en supprimant le préfixe et la commande
        const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Vote')
        .setDescription(question)
        .setFooter('Votez en réagissant avec 👎, 👍 ou 🤷‍♂️');

        interraction.reply(embed)
        .then(msg => {
            msg.react('👎');
            msg.react('👍');
            msg.react('🤷‍♂️');
        })
        .catch(console.error);
    }

    // GAMELLE
    if (interraction.commandName === 'gamelle') {
       const gamelle = Math.random();
       if(gamelle > 0.5) {
        interraction.reply({ content: `🍲 ${interraction.member}, manger ta gamelle au bureau est généralement plus économique, plus sain et plus pratique que de manger à l'extérieur !` })
       } else {
        interraction.reply({ content: `🍔 ${interraction.member}, manger à l'extérieur peut offrir une pause relaxante et agréable dans la routine quotidienne et permettre de découvrir de nouvelles saveurs et cultures culinaires !` })
       }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return; // Ignore les réactions des bots
  
    const message = reaction.message;
    const thumbsUp = message.reactions.cache.get('👍');
    const thumbsDown = message.reactions.cache.get('👎');
    const shrug = message.reactions.cache.get('🤷‍♂️');
  
    if (reaction.emoji.name === '👍') {
      thumbsUp.users.remove(user.id); // Empêche les utilisateurs de voter plusieurs fois
    }
    else if (reaction.emoji.name === '👎') {
      thumbsDown.users.remove(user.id);
    }
    else if (reaction.emoji.name === '🤷‍♂️') {
      shrug.users.remove(user.id);
    }
  });



client.login(process.env.TOKEN);