# Imagem base que vou usar, versão 22
FROM node:22

# O diretório que vamos usar
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "server"]