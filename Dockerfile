FROM node:12.16.3-alpine

ENV ENV_SILENT=true

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn global add @adonisjs/cli nodemon

RUN chown -R node:node /app
USER node

EXPOSE 3334

CMD ["adonis", "serve"]
