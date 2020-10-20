FROM node:12.19.0

ENV ENV_SILENT=true

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn global add @adonisjs/cli nodemon

RUN chown -R node:node /app
USER node

EXPOSE 3334

CMD ["adonis", "serve"]
