'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const { url } = require('inspector');
const path = require('path');
const token = process.env.IMGTOKEN;
const prefix = "!";

//A way to store both userId's, userNames and nicknames into arrays.
//They are 1 to 1 so the 3rd position in IdArray is the same person
//as the 3rd position in the NameArray/NickArray.
var userIdArray = new Array();
var userNameArray = new Array();
var userNickArray = new Array();

const validImgQuery = ["i","im","img","imag","image","v","vi","vid","vide","video"];
const imgTypes = [".webp",".png",".jpg",".jpeg",".gif"]
const vidTypes = [".mp4",".webm",".mov"]

//var imgArray = new Array();
//var vidArray = new Array();

const client = new Discord.Client({fetchAllMembers:true});

client.once('ready', () => {
    //Adding all the users the global constants.
    //Making it able to be used in other functions.
    //createUserFiles();
    console.log("The bot is online!");
})

client.on("message",msg => {
    if(msg.author.bot) return;
    let userMsg = msg.content.slice(1);
    let msgUserName = userMsg.split(' ')[0];
    let imgOrVid = userMsg.split(' ')[1];

    loadAllusers(msg);
    createUserFiles();

    //Saves lines in the 4 ifs below.
    let spoiler = msg.content.includes("SPOILER");
    //Set to 1 so that it won't create any issues with the length being 0 from the start.
    var urlLink = "1";
    if(msg.attachments.size > 0 && !spoiler)
    {
        urlLink = msg.attachments.array();
        urlLink[0] = urlLink[0].url;
    }
    //Tried to do these 2 statements into 1 but I couldn't quite figure out how to grab the url if it was an attachment
    //without just having an if then a nested if else which made it ugly.
    if(urlLink[0].length > 1 && imgInArray(urlLink[0]) && !urlLink[0].includes(spoiler))
    {
        //Always overwriting the array at 0 to grab the image. And that way I don't
        //have to constantly update the array search.
        fs.appendFile("./UsersImages/" + msg.author.id + "img.txt", "\n"+ urlLink, (err) => {
            if(err) throw err;
            })
        console.log(`${urlLink} added to ${msg.author.id}'s image file.`)
        return;
    }
    //This one grabs images that are uploaded as links vs the one above grabbing them as uploaded files.
    else if(imgInArray(msg.content) && msg.content.startsWith("https://") && !spoiler)
    {
        fs.appendFile("./UsersImages/" + msg.author.id + "img.txt", "\n"+ msg.content, (err) => {
            if(err) throw err;
        })
        console.log(`${msg.content} added to ${msg.author.id}'s image file.`)
        return;
    }
    let vidLink = msg.content;
    if(urlLink[0].length > 1 && vidInArray(urlLink[0]) && !urlLink[0].includes(spoiler))
    {
        fs.appendFile("./UsersVideos/" + msg.author.id + "vid.txt", "\n"+ urlLink, (err) => {
            if(err) throw err;
        })
        console.log(`${urlLink[0]} added to ${msg.author.id}'s video file.`)
        return;
    }
    else if(vidLink.includes("https://twitter") || vidLink.includes("https://www.youtube") || 
    vidLink.includes("https://youtu.be") || vidLink.includes("https://cdn") || vidLink.includes("gif")
    && !vidLink.includes(spoiler))
    {
        fs.appendFile("./UsersVideos/" + msg.author.id + "vid.txt", "\n"+ msg.content, (err) => {
            if(err) throw err;
        })
        console.log(`${msg.content} added to ${msg.author.id}'s video file.`)
        return;
    }

    if(msg.content.startsWith(prefix))
    {
        //My son is a good christian boy.
        if(msg.channel.nsfw) return;
        if(msg.content.startsWith(prefix + "commands"))
        {
            msg.channel.send("Use !username or !usernick and i-image or v-video to grab a random video or image from that user.");
            msg.channel.send("Like this !X i or !X img will both pull an image from X's file.")
            return;
        }
        /*
        if(msg.content.startsWith(prefix + "test"))
        {
            msg.channel.send("This is a test of the bot");
        }*/
        else if(userIdArray.includes(usernameInIDArray(msgUserName)) && validImgQuery.includes(imgOrVid))
        {
            if(validImgQuery.indexOf(imgOrVid) < 5)
            {
                let grabImg = "./UsersImages/" + usernameInIDArray(msgUserName) + "img.txt";
                let sendImg = randomLineInFile(grabImg);
                if(sendImg != "") msg.channel.send(sendImg);
            }
            else
            {
                let grabVid = "./UsersVideos/" + usernameInIDArray(msgUserName) + "vid.txt";
                let sendVid= randomLineInFile(grabVid);
                if(sendVid != "") msg.channel.send(sendVid);
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
                if(sendImg != "") msg.channel.send(sendImg);
            }
            else
            {
                let grabVid = "./UsersVideos/" + nicknameInIDArray(msgUserName) + imgOrVid +".txt";
                let sendVid= randomLineInFile(grabVid);
                if(sendVid != "") msg.channel.send(sendVid);
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
function imgInArray(msg) 
{
    for (let i = 0; i < imgTypes.length; i++) 
    {
        if (msg.includes(imgTypes[i])) 
        {
            return true;
        }
    }
    return false;
}

function vidInArray(msg) {
    for (let i = 0; i < vidTypes.length; i++) 
    {
        if (msg.includes(vidTypes[i])) 
        {
            return true;
        }
    }
    return false;
}

client.login(token);