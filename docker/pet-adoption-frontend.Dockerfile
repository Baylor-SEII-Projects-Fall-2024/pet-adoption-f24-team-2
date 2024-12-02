FROM node:20
ENV NEXT_PUBLIC_BACKEND_URL=http://104.198.233.250:8080
WORKDIR /app
COPY package.json yarn.lock ./
ENV YARN_NETWORK_TIMEOUT=100000
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
ENTRYPOINT exec yarn start