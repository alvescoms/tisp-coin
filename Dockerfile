FROM node:16

ARG BOT_TOKEN
ARG SERVER_CHANNEL_ID
ARG BOT_ID
ARG SERVER_ID

RUN mkdir /tispcoin

COPY . /tispcoin

WORKDIR /tispcoin

RUN cp src/config.json.template src/config.json

RUN sed -i -e 's/BOT_TOKEN/'${BOT_TOKEN}'/g'\
        -i -e 's/SERVER_CHANNEL_ID/'${SERVER_CHANNEL_ID}'/g'\
        -i -e 's/BOT_ID/'${BOT_ID}'/g'\
        -i -e 's/SERVER_ID/'${SERVER_IDg}'/g' src/config.json

RUN npm install

RUN yarn deploy-commands

CMD ["yarn", "start"]