FROM node:20

WORKDIR /app

COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

RUN yarn install

COPY ./pet-adoption-frontend .

RUN yarn build

EXPOSE 3000
ENTRYPOINT exec yarn start