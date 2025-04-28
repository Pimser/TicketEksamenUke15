# Bruk en offisiell Node.js-bilde som base
FROM node:20

# Sett arbeidsmappe inne i containeren
WORKDIR /app

# Kopier package.json og package-lock.json først (for raskere bygging hvis bare kode endres)
COPY package*.json ./

# Installer avhengigheter
RUN npm install

# Kopier resten av prosjektfilene inn i containeren
COPY . .

# Applikasjonen din skal bruke port 3000 (eller en annen hvis du har spesifisert en port)
EXPOSE 3000

# Kommandoen for å starte appen
CMD ["node", "server.js"]
