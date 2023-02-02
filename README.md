# Orbit Web Client

## Description
Orbit is a messaging platform designed from the ground up to be fully private, customizable and secure.

Its main goal is anonymity: everything is stored in a manner that doesn't allow it to be viewed after it has been stored in our database.

### What You Gonna Do With My Data?

The only things we store outside of the messages themselves are:

- your email, which is stored as a SHA-512 hash and is only used to verify your identity.
- your username, which is displayed publicly (so don't use your real name if you don't want people to know it)
- your apple pie recipes (because pie)

### What about messages and files?

They are fully encrypted using a public/private RSA key pair generate by your client when you first sign up. The private key is the encrypted with your password and stored on our server for you to be able to access anywhere. 

All encryption happens on your device. The server simply stores this encrypted data so that it can send it to your recipients and allow you to access your data on any device. The server cannot read your data.

### Where Can I Get It?

As of now there is a offical Desktop and Web client. Later down the line there will be support for mobile, but priority right now is optimizing the Web/Desktop client to run well on all devices

Offical Web Client: [https://orbit.novastudios.uk](https://orbit.novastudios.uk)

## Requirments
- [NodeJS](https://nodejs.org/en/download/)
- NPM

## Gettings the sources
Download a zipped version [here](https://github.com/Nova-Studios-Ltd/Orbit-Web/archive/refs/heads/master.zip)
or clone via HTTPS:
```
git clone https://github.com/Nova-Studios-Ltd/Orbit-Web.git
```

## Running/Building
Note: If you wish to use your own instance of the API change API_DOMAIN and WEBSOCKET_DOMAIN in vars.ts in the src of the project

Run:
```
cd orbit-web
npm install
npm start
```
The client will then be available at http://localhost:3000/

Build:
```
cd orbit-web
npm install
npm build
```
Then host with your choice of web server (The offical uses Apache2, with some custom rewrite rules)

# Questions:
Q: Will there be a Docker image?

A: I plan to package the API, SQL Database, and Client into a easy to setup docker image

## Roadmap
[Trello board](https://trello.com/b/txTutVEp/web-nova-chat-3-orbit)

## Contributing
We are open to people contributing, we will have better defined guidelines later on!

## License
The project is currently licensed under a GPLv3 license

## Project status
Development is on going! Please be aware that both me (Nova1545) and my collegue (GentlyTech) currently work or are in school full time, so updates and changes maybe be slow at times
