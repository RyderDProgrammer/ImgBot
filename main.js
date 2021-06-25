'use strict';
const Discord = require('discord.js');
const token = process.env.IMGTOKEN;
const serverID = process.env.BOTSERVERID;

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    const list = client.guilds.cache.get(serverID);
    const userNames = list.members.cache.map(member => member.user.username)
    console.log("The bot is online!");
    console.log(userNames);
})

client.login(token);