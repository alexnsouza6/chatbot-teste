const request = require('request');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

sendGreetingMessage = () => {
  response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
        }]
      }
    }
  }
}


fetchUserInfo = (sender_psid) => {
  axios.get(`https://graph.facebook.com/v2.6/${sender_psid}?fields=first_name,last_name&access_token=${PAGE_ACCESS_TOKEN}`)
    .then(response => {
      let greeting;

      greeting = {
        "text": `Hello, ${response.data.first_name}! How are you doing?`
      }

      console.log(greeting);

      //callSendAPI(sender_psid, greeting);
    })
}

// Handles messages events
handleMessage = function(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  } 
  else if (received_message.attachments) {
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }  
  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
handlePostback = function(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
callSendAPI = function(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
   // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 

}

// Sends response messages via the Send API
getUserInfo = function(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
   // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 

}


// A postback originates from the client browser. 
// Usually one of the controls on the page will be manipulated
// by the user (a button clicked or dropdown changed, etc), 
// and this control will initiate a postback. 
// The state of this control, plus all other controls on the page,
// (known as the View State) is Posted Back to the web server.

export default {
  handlePostback,
  handleMessage,
  fetchUserInfo,
  sendGreetingMessage
};
