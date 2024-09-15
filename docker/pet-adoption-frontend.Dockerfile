FROM node:21-alpine3.19

WORKDIR /app

COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

RUN yarn install

COPY ./pet-adoption-frontend .

EXPOSE 3000

CMD ["yarn", "dev"]