# Orbit Web Interface

## Description
Repository for the official Orbit Web Interface. The purpose is to allow it's users to see and audit the client they are using (and build if they wish, instructions bellow). We plan to open-source the API aswell once it is in a state where it can be used by anyone


## Requirments
- [NodeJS](https://nodejs.org/en/download/)
- NPM

## Gettings the sources
Download a zipped version [here](https://gitlab.novastudios.uk/orbit/orbit-web-interface/-/archive/main/orbit-web-interface-main.zip)
or via HTTPS:
```
git clone https://gitlab.novastudios.uk/orbit/orbit-web-interface.git
```

## Running/Building
Note: If you wish to use your own instance of the API change API_DOMAIN and WEBSOCKET_DOMAIN in vars.ts in the src of the project

Run:
```
cd orbit-web-interface
npm install
npm start
```
The client will then be available at http://localhost:3000/

Build:
```
cd orbit-web-interface
npm install
npm build
```
Then host with your choice of web server (The offical uses Apache2, with some custom rewrite rules)

# Questions:
Q: Will there be a Docker image?
A: I plan to package the API, SQL Database, and Client into a easy to setup docker image

## Support
TBD

## Roadmap
May share Trello board in future

## Contributing
TBD

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
The project is currently licensed under a GPLv3 license

## Project status
Development is on going!
