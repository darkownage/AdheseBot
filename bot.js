var Discord = require('discord.io');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var auth = require('./auth.json');

var winston = require('winston');

var PAUL = '492601218313748480';
var BOSS = '496641958970785792';
var BOBS = ['248152313410093057', '157606631293714432', '492601758003232788'];
var ONZINCHAT = '492600858081624064';

var users = {};
users['anthony'] = '248152313410093057';
users['joren'] = '157606631293714432';
users['kevin'] = '147779876567384064';
users['kim'] = '489040911360196611';
users['laurens'] = '492601758003232788';
users['mateusz'] = '492601111476436993';
users['paul'] = '492601218313748480';
users['ron'] = '496217137996890112';
users['sander'] = '461802589500211200';


var images = {};
images['emilia'] = 'images/emilia.png';
images['counting'] = 'images/counting.png';
images['onzin'] = 'images/nottheonzinchat.png';

var TIME = {};
var start = new Date().getTime();

var logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
	logger.info(user + " " + userID + " " + channelID);
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        //args = args.splice(1);
        switch(cmd) {
			case 'commands':
				send_message_to_discord('!beer - to show if it\'s time for a beer\n!status - to see how long the bot has been running\n!slap <slappee> - to slap a user\n!jarvis - for fun\n!friet - for fun\n!fortune - ask Sander\n!...',channelID);
				break;
            case 'beer':
				var today = new Date();
				if (BOBS.includes(userID)) {
					send_message_to_discord('I have identified you, ' + user + ' as a non-drinker, please drink a cola or something', channelID);
				} else if (userID == BOSS) {
					send_message_to_discord('You\'re the boss, you can drink whenever you want!', channelID);
				} else if ((today.getDay() == 5) && (today.getHours() >= 14)) {
					send_message_to_discord('It\'s friday and it\'s after 16h, so the chances are that you could drink a beer and get away with it!', channelID);
				} else {
					send_message_to_discord('It\'s not yet friday 16h! Drink water or something!', channelID);
				}
			break;
			case 'status':
				running = new Date().getTime() - start;
				send_message_to_discord('I have been running for ' + running + 'ms', channelID);
				break;
			case 'slap':
				slappee= args[1];
				if (slappee.toLowerCase() in users) {
					send_raw_message_to_discord('I have been asked by ' + user + ' to slap <@' + users[slappee.toLowerCase()] + '>', channelID);
				} else {
					send_message_to_discord('I have been asked to slap an unknown user, possible slappees are: ' + users.keys(), channelID);
				}
				break;
			case 'jarvis':
				send_message_to_discord(user + ', did you summon me?',channelID);
				break;
			case 'friet':
				send_message_to_discord('A wise man once said: "a frietje a day keeps the doctor away", so enjoy it!', channelID);
				break;
			case 'fortune':
				var Http = new XMLHttpRequest();
				const url = 'http://yerkee.com/api/fortune';
				Http.open("GET", url);
				Http.send();
				Http.onreadystatechange=(e)=> {
					var text = Http == null? "" : Http.responseText;
					text = text.substring(11, text.length - 1);
					// Fuck this shit
					text = text.replace("\\n\\t\\t", " ");
					text = text.replace("\\t", " ");
					text = text.replace("\\t", " ");
					text = text.replace("\\t", " ");
					text = text.replace("\\t", " ");
					text = text.replace("\\n", " ");
					text = text.replace("\\n", " ");
					text = text.replace("\\n", " ");
					text = text.replace("\\n", " ");
					text = text.replace("\\\"", " ");
					if (text.length > 0) {
						send_message_to_discord(text, channelID);
						Http = null;
					}
				}
				break;
			case 'onzin':
				post_image(images['onzin'], channelID);
				break;
			case 'image':
				category = args[1].toLowerCase();
				if (category in images) {
					post_image(images[category], channelID);
				} else {
					send_message_to_discord('File not found',channelID);
				}
				break;
			case 'dance':
				post_gif('https://media.giphy.com/media/qNnQAESrblfDG/giphy.gif', channelID);
				break;
			case 'timer': 
				if (TIME.user == undefined || TIME.user == null) {
					TIME.user = new Date().getTime();
					send_message_to_discord('Starting timer for ' + user, channelID);
				} else {
					var DELTA = new Date().getTime() - TIME.user;
					TIME.user = null;
					send_message_to_discord(DELTA + ' millies have passed for user ' + user, channelID);
				}
				break;
         }
		} else if (message.toLowerCase().includes("permission") && channelID != ONZINCHAT) {
			tag(PAUL, channelID);
		} else if (message == '#suckstobeyou') {
			send_message_to_discord('Haha', channelID);
		}
});

function post_gif(link, channelID) {
	bot.sendMessage({
	  to: channelID,
	  message: '', // You can also send a message with the embed.
	  embed: {
		color: 6826080,
		footer: { 
		  text: ''
		},
		thumbnail:
		{
		  url: link
		},
		title: '',
		url: link
	  }
	});
}

function post_image(file, channelID) {
	bot.uploadFile({
		to: channelID,
		file: file
	});
}

function send_message_to_discord(message_to_display, channelID) {
	bot.sendMessage({
		to:channelID,
		message: '```' + message_to_display + '```'
	});
}

function send_raw_message_to_discord(message_to_display, channelID) {
	bot.sendMessage({
		to:channelID,
		message:  message_to_display
	});
}

function tag(userID, channelID) {
	bot.sendMessage({
		to:channelID,
		message: '<@'+userID+'>'
	});
}
