FROM node:14.16.1 as js_base

WORKDIR /app/

RUN ls -al
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY tsconfig.json ./tsconfig.json

RUN ls -al
RUN npm install

FROM js_base as frontend

COPY ./public/ ./public/
COPY ./src/ ./src/
EXPOSE 3000

CMD [ "npm" , "start" ]