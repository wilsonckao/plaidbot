const express = require('express');
const router = express.Router();
const request = require('request');

const base = 'http://52.57.194.181:3000/api/v1';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flight webhook client' });
});

router.post('/', handleReq);


function handleReq(req,response){
  const state = { req : req };

  if(req.body && req.body.result && req.body.result.parameters){
    const params = req.body.result.parameters;

    if(params.to && params.from && params.departure){
      // http://52.57.194.181:3000/api/v1/flights/search?adults=1&arrivalCity=FRA&babies=1&children=1&comebackDate=2018-07-25&departureCity=EIN&departureDate=2018-06-20&language=eng
      request.get({url:base+'/flights/search',qs:{"departureCity" : params.from.IATA,"arrivalCity" : params.to.IATA, departureDate:params.departure}},(err,res,body)=>{
      //request.get('http://52.57.194.181:3000/api/v1/flights/search?adults=1&arrivalCity=FRA&babies=1&children=1&comebackDate=2018-07-25&departureCity=EIN&departureDate=2018-06-20&language=eng',(err,res,body)=>{
        if(err) res.status(200).send({error:JSON.stringify(err)})
        if(res.statusCode == 200){
          const data = JSON.parse(body);
          if(data && data.length == 0 ){
            // no flights Found
            response.send({
              "displayText": "No flights Found :( !",
              "data": {
                "google": {
                  "expectUserResponse": false,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "No flights Found :( !"
                        }
                      }
                    ]
                  }
                }
              }
            })
          } 
          // if flights found  
          let message = 'we have found total of '+data.length+" flights. The Cheapest of them is for "+ data[0].price+" "+data[0].general.currency+"."; 
          if (isObject(data[0].forwardSector)) message = message + " The flight will be from "+data[0].forwardSector.departureCity+" to "+data[0].forwardSector.arrivalCity+ " and the Flight time would be "+data[0].forwardSector.duration+"."
          if (isObject(data[0].comebackSector)) message = message + " The returning flight will be from "+data[0].comebackSector.departureCity+" to "+data[0].comebackSector.arrivalCity+ " and the Flight time would be "+data[0].comebackSector.duration+"."
          
          response.send({
            "fulfillmentText": `${message}`,
            "displayText": `${message}`,    
            "messages": [
              {
                "type": 0,
                "speech": `${message}`
              }
            ],        
            "data": {
              "google": {
                "expectUserResponse": false,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": `${message}`
                      }
                    }
                  ]
                }
              }
            }
          });
        }
      })
    }
  }

}


isObject = function(a) {
  return (!!a) && (a.constructor === Object);
};
module.exports = router;
