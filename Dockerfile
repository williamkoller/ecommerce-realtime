FROM node:14.15-alpine3.10

ENV ENV_SILENT=true

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn global add @adonisjs/cli nodemon

EXPOSE 3334

CMD ["adonis", "serve"]
