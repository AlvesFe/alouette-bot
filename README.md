# Alouette 🕊️🎐

## Bot de músicas para o discord

## Construído com

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Pré-requisitos

* `NodeJs` versão `16.16.0` ou maior
* `Yarn` versão `1.22.19` ou maior

## Como instalar

* Clone esse repositório
* Na raíz do repositório execute `yarn install`

## Como executar
* Na raiz do repositório crie um arquivo chamado `.env`
* No arquivo criado insira as seguintes linhas:
```
TOKEN="SECRET TOKEN DO BOT"
CLIENT_ID="APPLICATION ID DO BOT"
GUILD_ID="ID DO SERVIDOR QUE IRA TESTAR"
BOT_COLOR="COR DO BOT, UTILIZANDO HEXADECIMAL (#FFFFFF)"
IDLE_TIME_SECONDS="TEMPO EM SEGUNDOS PARA O BOT SAIR DO CANAL DE VOZ"
SPOTIFY_CLIENT_ID="ID DO CLIENT DO SPOTIFY"
SPOTIFY_SECRET="SECRET DO CLIENT DO SPOTIFY"
```
* Execute o comando `yarn start`
  * Se deseja desenvolver funções para o bot, é recomendado usar o comando `yarn dev`
##### **OBS:** Para conseguir o `TOKEN` e o `CLIENT_ID` do bot, acesse o [Discord Developer Portal](https://discord.com/developers/applications) e crie uma aplicação, após isso crie um bot e copie o token e o client id.

##### **OBS²:** Para conseguir o `SPOTIFY_CLIENT_ID` e o `SPOTIFY_SECRET` do bot, acesse o [Spotify Developer Portal](https://developer.spotify.com/dashboard/) e crie uma aplicação, após isso copie o client id e o secret.