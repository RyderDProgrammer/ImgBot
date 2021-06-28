'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const token = process.env.IMGTOKEN;
const serverID = process.env.BOTSERVERID;
const prefix = "!";

//A way to store both userId's and userNames into arrays.
//They are 1 to 1 so the 3rd position in IdArray is the same person
//as the 3rd position in the NameArray.
var userIdArray = new Array();
var userNameArray = new Array();
var userNickArray = new Array();

const validImgQuery = ["i","im","img","imag","image","v","vi","vid","vide","video"];

var imgArray = new Array();
var vidArray = new Array();

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    //Adding all the users the global constants.
    //Making it able to be used in other functions.
    loadAllUserInfo();
    console.log("The bot is online!");
    createUserFiles();
})

client.on("message",msg => {
    if(msg.author.bot) return;
    let userMsg = msg.content.slice(1);
    let msgUserName = userMsg.split(' ')[0];
    let imgOrVid = userMsg.split(' ')[1];

    loadAllUserInfo();
    
    let imgFilter = () => msg.attachments.size > 0 && isImage(msg);
    let imgCollect = new Discord.MessageCollector(msg.channel,imgFilter);

    if(msg.content.startsWith(prefix))
    {
        if(msg.content.startsWith(prefix + "test"))
        {
            msg.channel.send("This is a test of the bot");
        }
        else if((userIdArray.includes(usernameInIDArray(msgUserName)) || userIdArray.includes(nicknameInIDArray(msgUserName))) 
                && validImgQuery.includes(imgOrVid) )
        {
            if(validImgQuery.indexOf(imgOrVid) < 5)
            {
                msg.channel.send("https://anopensuitcase.com/wp-content/uploads/2016/11/maui.jpg");
            }
            else
            {
                msg.channel.send("https://www.youtube.com/watch?v=5qap5aO4i9A");
            }
        }
        else
        {
            msg.channel.send("That is not a valid command I can do");
        }
    }
})

function usernameInIDArray(name)
{
    let idAsName = userNameArray.indexOf(name);
    console.log(idAsName);
    let nameAsID = userIdArray[idAsName];
    console.log(nameAsID);
    return nameAsID;
}

function nicknameInIDArray(nick)
{
    let idAsNick = userNickArray.indexOf(nick);
    console.log(idAsNick);
    let nameAsID = userIdArray[idAsNick];
    console.log(nameAsID);
    return nameAsID;
}

function loadAllUserInfo()
{
    const list = client.guilds.cache.get(serverID);

    userIdArray = list.members.cache.map(member => member.user.id);
    userNameArray = list.members.cache.map(member => member.user.username);
    userNickArray = list.members.cache.map(member => member.nickname);

    console.log(userIdArray);
    console.log(userNameArray);
    console.log(userNickArray);
}

function createUserFiles()
{
    //Creating the users image file to hold pictures links.
    for(let i = 0; i < userIdArray.length; i++)
    {
        var fileExist = userIdArray[i] + "img.txt";
        if(fs.existsSync(fileExist))
        {

        }
        else
        {
            var currUser = (userIdArray[i] + "img.txt");
            fs.writeFile(path.join(__dirname,'/UsersImages',currUser),'',err =>{
                if(err) throw err;
            })
        }
    }
    //Creating the users video files to hold video links.
    for(let i = 0; i < userIdArray.length; i++)
    {
        var fileExist = userIdArray[i] + "vid.txt";
        if(fs.existsSync(fileExist))
        {

        }
        else
        {
            var currUser = (userIdArray[i] + "vid.txt");
            fs.writeFile(path.join(__dirname,'/UsersVideos',currUser),'',err =>{
                if(err) throw err;
            })
        }
    }
}

client.login(token);