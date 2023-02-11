# Orbit Web Client

## Description

Orbit, a self-hosted communication platform designed with anonymity and privacy in mind. This repository contains the official **web** client.

## Requirements

- [Node.js](https://nodejs.org/en/download/)
  - npm (normally included)
- A browser
  - that is not Internet Explorer; and
  - supports the following APIs:

    - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    - [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
    - [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
    - [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/indexedDB)
    - [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
    - [Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)
    - Whatever else React and [MUI](https://mui.com/material-ui/getting-started/supported-platforms/) depend on

## Getting the Source Code

Download a zipped version [here](https://github.com/Nova-Studios-Ltd/Orbit-Web/archive/refs/heads/master.zip)
or clone via HTTPS:

```sh
git clone https://github.com/Nova-Studios-Ltd/Orbit-Web.git
```

## Running/Building

Note: If you wish to use your own instance of the API then change `API_DOMAIN` and `WEBSOCKET_DOMAIN` in `./src/vars.ts` of this project.

### Run From Source

```sh
cd orbit-web
npm install
npm start
```

The client will then be accessible via browser at <http://localhost:3000/>

### Run From Source (with HTTPS)

**Warning: running under HTTPS may break API requests due to CORS policy (so... don't).**

Typically there is no reason for running the development version under HTTPS, but this may be useful if you want to test the app on Safari in iOS (since Safari prevents you from logging in under insecure contexts, because Apple).

To configure webpack for HTTPS, create a folder called `ssl` in the project root.
Inside of it, place an SSL certificate (call it `cert.crt`) and its corresponding private key (call it `cert.key`) in the folder.
You can use a certificate issued by a global CA, or you can create your own CA and generate a self-signed SSL certificate. However, note that unless you can access the domain name(s) the certificate is registered to inside the network, the browser will scream at you.

To create a CA, you can either use a program like easy-rsa, or manually create one using OpenSSL (easy-rsa is pretty straightforward, so maybe use that).

To generate a self-signed SSL certificate after creating a CA, follow some guide on the internet, or use the help/manpages provided by the program you're using.

Then run the following command to start webpack with HTTPS instead.

```sh
npm run secure
```

The client will then be accessible via browser at <https://localhost:3000/> (don't forget the **s** in http**s** or else you'll get an empty response).

### Build

Note: this method will generate optimized, static assets that are meant to be served by a production web server.

```sh
cd orbit-web
npm install
npm build
```

Then spin up a web server of your choice and copy the files from the build folder to the root of the server (the official API uses `apache2` with some custom rewrite rules). Refer to the [API](https://github.com/Nova-Studios-Ltd/Orbit-API) README on how to configure your own web server.

## Questions

**Q**: Will there be a Docker image?

**A**: Currently there is no Docker image. However, the plan is to bundle the API, SQL Database, and Client into an easy to setup docker image at some point in the future.

## Support

Spam Nova1545.

## Roadmap

We have a [trello board](https://trello.com/b/txTutVEp/web-nova-chat-3-orbit) for documenting features we are working on or are considering to implement.

## Contributing

We are open to people contributing! However, currently there are no guidelines on how to do so. We will write some soon!

## License

This project is currently licensed under a GPLv3 license.

## Project Status

Development is ongoing! Please be aware that our development team currently work full time (elsewhere) or are in school, so updates and changes may be slow at times.
