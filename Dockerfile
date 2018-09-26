FROM debian:jessie

RUN apt-get update \
	&& apt-get install -y node \
	&& mkdir -p /root/
	
COPY files/auth.json /root/auth.json
COPY files/package.json /root/package.json
COPY files/bot.js /root/bot.js

RUN cd /root/ \
	&& npm install discord.io winston \
	&& npm install https://github.com/woor/discord.io/tarball/gateway_v6 \
	&& node bot.js
