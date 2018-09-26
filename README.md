# Introduction
This is a repo that contains all the code for the AdheseBot, which is a Discord Bot written in Node.js

# How to run it?
Normally the Docker image should do all the heavy lifting by installing Node and installing all the dependencies needed.
In case it doesn't work, just install Node.js which should come with a version of NPM.
Then just do ```npm install discord.io winston``` and also ```npm install https://github.com/woor/discord.io/tarball/gateway_v6```

To run it, just do ```node bot.js``` and it should work normally.

You also need to create an auth.json file in your directory, which won't be in Git due to it being a token.
It can be found through Discord, detailled info will be given offline, cause if you have the token, you kinda control the bot :D
