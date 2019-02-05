FROM alpine:latest

RUN apk update \
	&& apk add --update nodejs nodejs-npm \
	&& mkdir -p /root/
	
COPY auth.json /root/auth.json
COPY package.json /root/package.json
COPY bot.js /root/bot.js

RUN cd /root/ \
	&& npm install discord.io winston xmlhttprequest \
	&& npm install https://github.com/woor/discord.io/tarball/gateway_v6 \
	&& node bot.js
