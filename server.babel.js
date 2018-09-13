'use strict';
const path = require('path');
const express = require('express');
//const compression = require('compression');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');
import React from 'react';
import { appConfig } from './config';
import { kraken } from './constants'

const credentials = {
  key: fs.readFileSync('./key.pem', 'utf8'),
  cert: fs.readFileSync('./cert.pem', 'utf8')
};
// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  secureApp.close(function() {
    console.log("Closed out remaining connections.");
    process.exit()
  });

   // if after
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit()
  }, 10*1000);
}

let app = express();
const jsonParser = bodyParser.json()


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(compression());
app.use(cookieParser());

if(process.env.NODE_ENV != 'production') {
  app.use('/', express.static(path.join(process.cwd(), 'public')));
}

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

app.get('*', function(req, res) {
  res.locals.app_stylesheets = '<script src="/src/layouts/main.js"></script>';
  res.locals.app_scripts = `\n <script src="/js/plugins.js"></script>\n <script src="/js/app.js"></script> \n <script src="https://maps.googleapis.com/maps/api/js?key=${appConfig.MAPS_API_KEY}&libraries=places&callback=initAutocomplete"
        async defer></script> \n`
    console.log('url hit')

  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

//renderHTML);

var secureApp = https.createServer(credentials, app).listen(appConfig.httpsPort, async () => {
  console.log(`Node.js app is running at https://localhost:${appConfig.httpsPort}/`);
  try {
    const krakPromise = new Promise((resolve, reject) => {
//      return kraken.api('Assets', { asset: 'BCH,XXBT' })
    //  return kraken.api('AssetPairs', {pair: 'ETHEUR'})
      return kraken.api('Ticker', { pair : 'XBTEUR' })
    //  return kraken.api('OHLC', { pair: 'ETHEUR' })
    //  return kraken.api('Time')
    }).catch((e) => {
      console.log('caught promise error', e)
    })
    console.log('kraken api await on the server in cli', await krakPromise)
  } catch(e) {
    console.log('async await e', e)
  }
})

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);

//exports default secureApp
