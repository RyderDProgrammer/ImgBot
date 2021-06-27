'use strict';
const Discord = require('discord.js');
const token = process.env.IMGTOKEN;
const serverID = process.env.BOTSERVERID;
const prefix = "!";

//A way to store both userId's and userNames into arrays.
//They are 1 to 1 so the 3rd position in IdArray is the same person
//as the 3rd position in the NameArray.
let userIdArray = new Array();
let userNameArray = new Array();

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    const list = client.guilds.cache.get(serverID);

    //Adding all the users the global constants.
    //Making it able to be used in other functions.
    userIdArray = list.members.cache.map(member => member.user.id);
    userNameArray = list.members.cache.map(member => member.user.username);
    console.log("The bot is online!");
    console.log(userIdArray);
    console.log(userNameArray);
})

client.on("message",msg => {
    
    //const args = msg.content.trim().split(/ +/g);

    let userMsg = msg.content.split('!');
    console.log(userMsg[1]);
    if(msg.author.bot) return;

    if(msg.content.startsWith(prefix + "test"))
    {
        msg.channel.send("This is a test of the bot");
    }

    if(userNameArray.includes(userMsg[1]))
    {
        msg.channel.send(userMsg[1]);
    }
})




client.login(token);