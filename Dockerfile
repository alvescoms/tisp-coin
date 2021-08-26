FROM node:16

ENV BOT_TOKEN
ENV SERVER_CHANNEL_ID
ENV BOT_ID
ENV SERVER_ID

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