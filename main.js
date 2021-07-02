'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const token = process.env.IMGTOKEN;
const serverID = process.env.BOTSERVERID;
const prefix = "!";

//A way to store both userId's, userNames and nicknames into arrays.
//They are 1 to 1 so the 3rd position in IdArray is the same person
//as the 3rd position in the NameArray/NickArray.
var userIdArray = new Array();
var userNameArray = new Array();
var userNickArray = new Array();

const validImgQuery = ["i","im","img","imag","image","v","vi","vid","vide","video"];
const imgTypes = [".webp",".png",".jpg",".jpeg",".gif"]

//var imgArray = new Array();
//var vidArray = new Array();

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    //Adding all the users the global constants.
    //Making it able to be used in other functions.
    // createUserFiles();
    console.log("The bot is online!");
})

client.on("message",msg => {
    if(msg.author.bot) return;
    let userMsg = msg.content.slice(1);
    let msgUserName = userMsg.split(' ')[0];
    let imgOrVid = userMsg.split(' ')[1];

    loadAllusers(msg);
    createUserFiles();

    msgInArray(msg);
    // let imgFilter = () => msg.attachments.size > 0 && isImage(msg);
    // let imgCollect = new Discord.MessageCollector(msg.channel,imgFilter);

    /*if(msg.attachments.size > 0)
    {
        console.log(msg.content);
        fs.appendFile("./UsersImages/" + msg.author.id + "img.txt", "\nhi", (err) => {
            if(err) throw err;
        })
    }*/

    //console.log(userIdArray);
    if(msg.content.startsWith(prefix))
    {
        if(msg.content.startsWith(prefix + "test"))
        {
            msg.channel.send("This is a test of the bot");
        }
        else if(userIdArray.includes(usernameInIDArray(msgUserName)) && validImgQuery.includes(imgOrVid))
        {
            if(validImgQuery.indexOf(imgOrVid) < 5)
            {
                let grabImg = "./UsersImages/" + usernameInIDArray(msgUserName) + imgOrVid +".txt";
                let sendImg = randomLineInFile(grabImg);
                msg.channel.send(sendImg);
            }
            else
            {
                let grabVid = "./UsersVideos/" + usernameInIDArray(msgUserName) + imgOrVid +".txt";
                let sendVid= randomLineInFile(grabVid);
                msg.channel.send(sendVid);
            }
        }
        //Originally had these 2 together but I figured that it'd be easier on myself personally to split them
        //so that way I know which xInIDArray to query.
        else if(userIdArray.includes(nicknameInIDArray(msgUserName)) && validImgQuery.includes(imgOrVid))
        {
            if(validImgQuery.indexOf(imgOrVid) < 5)
            {
                let grabImg = "./UsersImages/" + nicknameInIDArray(msgUserName) + imgOrVid +".txt";
                let sendImg = randomLineInFile(grabImg);
                msg.channel.send(sendImg);
            }
            else
            {
                let grabVid = "./UsersVideos/" + nicknameInIDArray(msgUserName) + imgOrVid +".txt";
                let sendVid= randomLineInFile(grabVid);
                msg.channel.send(sendVid);
            }
        }
        else
        {
            msg.channel.send("That is not a valid command I can do");
        }
    }
})

function loadAllusers(msg) {
    const guild = msg.guild.id;
    const list = client.guilds.cache.get(guild);

    userIdArray = list.members.cache.map(member => member.user.id);
    userNameArray = list.members.cache.map(member => member.user.username);
    userNickArray = list.members.cache.map(member => member.nickname);

    //console.log(userIdArray);
    //console.log(userNameArray);
    //console.log(userNickArray);
}

function usernameInIDArray(name)
{
    let idAsName = userNameArray.indexOf(name);
    //console.log(idAsName);
    let nameAsID = userIdArray[idAsName];
    //console.log(nameAsID);
    return nameAsID;
}

function nicknameInIDArray(nick)
{
    let idAsNick = userNickArray.indexOf(nick);
    //console.log(idAsNick);
    let nameAsID = userIdArray[idAsNick];
    //console.log(nameAsID);
    return nameAsID;
}


function createUserFiles()
{
    //Creating the users image file to hold pictures links.
    for(let i = 0; i < userIdArray.length; i++)
    {
        //This super ugly chunk of code ensures that it wont erase any data that
        //Already exist in the file and checks if the file exist or not.
        let fileExist = "./UsersImages/" + userIdArray[i] + "img.txt";
        fs.stat(fileExist, function(stat){
            if(stat)
            {
                console.log(`${userIdArray[i]} image log added`);
                let currUser = (userIdArray[i] + "img.txt");
                fs.writeFile(path.join(__dirname,'/UsersImages',currUser),'',err =>{
                    if(err) throw err;
                })
            }
        })
    }
    //Creating the users video files to hold video links.
    for(let i = 0; i < userIdArray.length; i++)
    {
        let fileExist = "./UsersVideos/" +userIdArray[i] + "vid.txt";
        fs.stat(fileExist, function(stat){
            if(stat)
            {
                console.log(`${userIdArray[i]} video log added`);
                let currUser = (userIdArray[i] + "vid.txt");
                fs.writeFile(path.join(__dirname,'/UsersVideos',currUser),'',err =>{
                    if(err) throw err;
                })
            }
        })
    }
}

//Originally was reading asynchronously now it just reads and actually returns the proper
//image based on this article I found.
//https://attacomsian.com/blog/reading-a-file-line-by-line-in-nodejs
function randomLineInFile(fileName)
{
    const data = fs.readFileSync(fileName,'utf-8');

    const lines = data.split(/\r?\n/);
    return lines[Math.floor(Math.random()*lines.length)]
}

//Checks whether or not the link posted for an image contains one of the image types.
function msgInArray(msg) 
{
    let msgString = msg.content;
    for (let i = 0; i < imgTypes.length; i++) 
    {
        if (msgString.includes(imgTypes[i])) 
        {
            console.log(msg.content);
        }
    }
}

client.login(token);