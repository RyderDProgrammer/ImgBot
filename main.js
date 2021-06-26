'use strict';
const Discord = require('discord.js');
const token = process.env.IMGTOKEN;
const serverID = process.env.BOTSERVERID;
const prefix = "/";

let allUsersArray = new Array();

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    const list = client.guilds.cache.get(serverID);
    
    //Adding all the users to a global constant.
    //Making it able to be used in other functions.
    allUsersArray = list.members.cache.map(member => member.user.id);
    console.log("The bot is online!");
    console.log(allUsersArray);
})

client.on("message",msg => {
    
    if(msg.author.bot) return;
    if(msg.content.startsWith(prefix + "test"))
    {
        msg.channel.send("This is a test of the bot")
    }
})




client.login(token);