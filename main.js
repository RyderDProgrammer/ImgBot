'use strict';
const Discord = require('discord.js');
const token = process.env.IMGTOKEN;
const serverID = process.env.BOTSERVERID;
const prefix = "*";

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    const list = client.guilds.cache.get(serverID);
    const userNames = list.members.cache.map(member => member.user.id)
    console.log("The bot is online!");
    console.log(userNames);
})

client.on("message",msg => {
    if(msg.author.bot) return;
    if(msg.content.startsWith(prefix + "test"))
    {
        msg.channel.send("This is a test of the bot")
    }
})




client.login(token);