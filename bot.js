var Discord = require('discord.io');

var auth = require('./auth.json');

var winston = require('winston');

var PAUL = '492601218313748480';
var BOBS = ['248152313410093057', '157606631293714432', '492601758003232788'];
var ONZINCHAT = '492600858081624064';

var TIME = {};

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
       
        args = args.splice(1);
        switch(cmd) {
            case 'beer':
				var today = new Date();
				if (BOBS.includes(userID)) {
					send_message_to_discord('You don\'t even drink, who are you kidding?', channelID);
				} else if ((today.getDay() == 5) && (today.getHours() >= 16)) {
					send_message_to_discord('It\'s friday and it\'s after 16h, so the chances are that you could drink a beer and get away with it!', channelID);
				} else {
					send_message_to_discord('It\'s not yet friday 16h! Drink water or something!', channelID);
				}
			break;
			case 'slap':
				send_raw_message_to_discord('_Slaps <@157606631293714432>_', channelID);
				break;
			case 'onzin':
				send_raw_message_to_discord('***Not the <#' + ONZINCHAT + '>*** chat', channelID);
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
			case 'jira':
				var action = args[0];
				var ticket = args[1];
				
				switch(action) {
					case 'to_do':
					case 'td':
						if (args.length == 2) {
							var base_url = 'http://jira.adhese.org/rest/api/latest/issue/AD-' + ticket;
							logger.info('base_url is ' + base_url);
							send_message_to_discord('Moving ticket #' + ticket + ' to to_do status!', channelID);
						}
					break;
					case 'in_progress':
					case 'ip':
						send_message_to_discord('Moving ticket #' + ticket + ' to in_progress status!', channelID);
					break;
					case 'code_review':
					case 'cr':
						send_message_to_discord('Moving ticket #' + ticket + ' to code_review status!', channelID);
					break;
					case 'functional_review':
					case 'fr':
						send_message_to_discord('Moving ticket #' + ticket + ' to functional_review status!', channelID);
					break;
					case 'assign':
						var assignee = args[2];
						var json = '{"fields": {"assignee":{"name":"' + assignee + '"}}}';
						send_message_to_discord('Assigning ticket #' + ticket + ' to ' + assignee + '!', channelID);
					break;
					case 'done':
						send_message_to_discord('Moving ticket #' + ticket + ' to done status!', channelID);
					break;
					case 'help':
						send_message_to_discord('Possible commands:\n!jira to_do <ticket_number>: moves ticket to to_do status\n'
							+ '!jira in_progress <ticket_number>: moves ticket to in_progress status\n'
							+ '!jira code_review <ticket_number>: moves ticket to code_review status\n'
							+ '!jira functional_review <ticket_number>: moves ticket to functional_review status\n'
							+ '!jira assign <ticket_number> <assignee>: assigns ticket to assignee\n'
							+ '!jira done <ticket_number>: moves ticket to done status', channelID);
					break;
					default:
						send_message_to_discord('I do not recognize your command: ' + action + ' ; Type !jira help to see a list of possible commands', channelID);
					break;
				}
			break;
         }
		} else if (message.toLowerCase().includes("permission") && channelID != ONZINCHAT) {
			tag(PAUL, channelID);
		} else if (message == '#suckstobeyou') {
			send_message_to_discord('Haha', channelID);
		}
});

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