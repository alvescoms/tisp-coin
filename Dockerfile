FROM node:16

ARG BOT_TOKEN
ARG SERVER_CHANNEL_ID
ARG BOT_ID
ARG SERVER_ID

# RUN apt-get update -y && apt-get upgrade -y && apt-get install curl -y

# RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# RUN apt-get install -y nodejs yarn

RUN mkdir /tispcoin

COPY . /tispcoin

RUN cd /tispcoin

RUN cp src/config.json.template src/config.json

RUN sed -i 's/BOT_TOKEN/${BOT_TOKEN}/g'\
        -i 's/SERVER_CHANNEL_ID/${SERVER_CHANNEL_ID}g'\
        -i 's/BOT_ID/${BOT_ID}g'\
        -i 's/SERVER_ID/${SERVER_ID}g' config.json

RUN npm install

RUN yarn deploy-commands

CMD ["yarn", "start"]