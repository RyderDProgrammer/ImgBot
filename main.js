const Discord = require('discord.js');
const token = process.env.IMGTOKEN;

const client = new Discord.Client();









client.once('ready', () => {
    console.log("The bot is online!");
})


client.login(token);