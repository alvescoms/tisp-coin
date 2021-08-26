FROM ubuntu:20.04

ARG BOT_TOKEN
ARG SERVER_CHANNEL_ID
ARG BOT_ID
ARG SERVER_ID

RUN apt-get update && apt-get install nodejs yarn -y

RUN mkdir /tispcoin

COPY . /tispcoin

RUN cd /tispcoin

RUN cp config.json.template config.json

RUN sed -i 's/BOT_TOKEN/${BOT_TOKEN}/g'\
        -i 's/SERVER_CHANNEL_ID/${SERVER_CHANNEL_ID}g'\
        -i 's/BOT_ID/${BOT_ID}g'\
        -i 's/SERVER_ID/${SERVER_ID}g' config.json

RUN yarn install

RUN yarn deploy-commands

CMD ["yarn", "start"]