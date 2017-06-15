FROM scomm/node-build:latest

WORKDIR /app
COPY . /app

RUN yarn install
RUN npm run build
