const request = require('request');
const fId = '249266862485821';
const accessToken = 'EAADGtBZAndj4BAPt2l7vf16RixnF5xiIR7sAoUvR1usLfRUZC5ewIaoCGDn9D3uOl1sxPnFqEAEO1ZAKUWKrxkGgqQVNlZBSa4brzas4vrscTTWqS6AFDXZAbBtoEP1ByOw8HcWyZATjZCrmM82OaxUyNZBKPQQR132kyTZC4xkShsAZDZD';

// type 6
exports.sendCards =function(recipientId,data) {
    let messageData = {
        "recipient":{
            "id":recipientId
        },
        "message":{
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"generic",
                    "elements":data.elements
                }
            }
        }
    };
    callSendAPI(messageData);
};

// type 7
exports.sendList =function(recipientId,data) {
    let messageData = {
        "recipient":{
            "id":recipientId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": data.top_element_style,
                    "elements": data.elements,
                    "buttons": data.buttons
                }
            }
        }
    };
    callSendAPI(messageData);
};

function callSendAPI(messageData) {
    setTimeout(function(){
        request({
            uri: 'https://graph.facebook.com/v2.9/'+fId+'/messages',
            qs: { access_token: accessToken },
            method: 'POST',
            json: messageData
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let recipientId = body.recipient_id;
                let messageId = body.message_id;
                console.log("Successfully sent generic message with id %s to recipient %s",
                    messageId, recipientId);
            }
            else {
            	console.log(error);
                console.log("Unable to send message.");
            }
        });
    },1000);
}
