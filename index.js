'use strict';
var callapi = require('./app.js');

//Webhook é o núcleo da experiência do bot do Messeger. Aqui é onde as mensagens 
// são recebidas, processadas e enviadas.

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body.(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'Messenger'));

  window.extAsyncInit = function() {
  // the Messenger Extensions JS SDK is done loading 
    console.log("TESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTETESTE")
  };

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
    
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      
      //Make a request to get user infos
      //callapi.fetchUserInfo(sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        callapi.handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        callapi.handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    console.log("Page not found");
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAAGIBRjmHqwBAGvADoagiXnQA8u8tUBEReUJHZBdxlg0xvMFtFAprBgdMOZC2yiZAucsh2IfnYhPcDeZCyKBskZC1vgKIP5M3gmrktZBnowiWRuaAXxYUvEXrocF1HjuIzZB5lYdIGSH5LtEveSVHHGNxA2RlZA5BccV0iZCQkPFZADxbIsarJ2GCc";
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});