# Use a imagem oficial do Node.js 20 como base
FROM node:20

# Crie o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências sem a flag --no-optional
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Copie o arquivo .env para o diretório de trabalho
COPY .env .env

# Construa o projeto
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
