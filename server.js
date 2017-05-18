'use strict';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const apiai = require('apiai')('2849dfafec2a4452a8c5c4a15813b072');
const superagent = require('superagent');
const nodemailer = require('nodemailer');

// my bot key: 2849dfafec2a4452a8c5c4a15813b072
// zach's bot key: 59b95837db154de18eb3f00d765e7b24
const API_CLIENT_KEY = '59b95837db154de18eb3f00d765e7b24';

const TECHNOLOGIES_USED = [/angular/i, /react.?js/i, /react/i, /react.?native/i, /swift/i, /objective.?c/i, /java.?script/i, /word.?press/i, /woo.?commerce/i,
/prestashop/i, /magento/i, /abe/i, /html/i, /css/i, /java/i, /android/i, /apache.?cordova/i, /node.?js/i, /node/i, /php/i, /symfony/i,
/zend/i, /laravel/i, /drupal/i, /meteor/i, /express/i, /jquery/i, /unity/i, /vr/i, /virtual.?reality/i, /augmented.?reality/i,
/phone.?gap/i];

const TECHNOLOGIES_NOT_USED = [/shopify/i, /c.?sharp/i, /visual.?basic/i, /cobol/i, /ruby/i];

const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: '2499d8c9ab60352442df4e5a93a1403a',
        pass: 'd33a2016a4671d6f7442b51738fbf340'
    }
});

app.post('/sendmail', function(req, res) {
  let botConvoEmail = {
      from: '"Ryan" <ryan.r.larkin@gmail.com>',
      to: 'ryan.r.larkin@gmail.com',
      subject: 'Test Form Submit',
      text: 'Hello world',
      html: '<b>Hello world</b>' // do we want an html body?
  };

  res.sendStatus(200);
  transporter.sendMail(botConvoEmail, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
});

io.on('connection', function(socket){
  let version = (new Date()).toISOString().slice(0,10).replace(/-/g,"");
  let sessionId = socket.id

  // On user connect, output the welcome message to start off the conversation
  superagent
  .post(`https://api.api.ai/v1/query?v=${version}`)
  .set('Content-Type', 'application/json; charset=utf-8')
  .set('Authorization', `Bearer ${API_CLIENT_KEY}`)
  .send({event: {name:'custom_welcome'}})
  .send({lang: 'en'})
  .send({sessionId: sessionId})
    .then(response => {
      socket.emit('chat message', response.body.result.fulfillment.speech);
    })

  let botResponse = "";

  // Will be true until a user enters something that is not offered by AdFab
  // Then it will be false and the bot will stop listening
  let botTalks = true;

  // These are here as flags for later so that we don't keep
  // Checking these values at every step of the conversation
  // Once they're checked, they're good for the rest of the conversation
  let isTechChecked = false;
  let isBudgetChecked = false;

  socket.on('chat message', (msg) => {
    if (botTalks) {
      superagent
      .post(`https://api.api.ai/v1/query?v=${version}`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Authorization', `Bearer ${API_CLIENT_KEY}`)
      .send({query: msg})
      .send({lang: 'en'})
      .send({sessionId: sessionId})
        .then(response => {
          response.body.result.contexts.forEach(context => {
            // check for the order context which means an order is in the process of being made
            if (context.name === 'order') {
              // make sure parameters are created
              if (context.parameters) {
                // always send the context to the front end
                socket.emit('order context', context.parameters);



                // if tech has not been checked yet, then check it
                if (!isTechChecked) {
                  // Check if the technologies parameter is present in the context
                  if (context.parameters.technologies.length) {

                    /*
                    .map on the user-entered contexts
                    create a new array of objects with tech name and true/false from the result of the some functions

                    if all in not used, return not used message
                    else if at least 1 in not used, return mix message
                    else return normal bot message
                    */

                    // for each tech entered by the user, check if it's in the list of technologies not used by AdFab
                    context.parameters.technologies.forEach(techEntered => {
                      if (TECHNOLOGIES_NOT_USED.some(techNotUsed => techNotUsed.test(techEntered))) {
                        socket.emit('tech not used', 'We apologize but we cannot use that technology. If you are flexible on this, please fill out the form below and we\'ll contact you as soon as we can to discuss other options.');
                        botTalks = false;
                      }
                      else if (!TECHNOLOGIES_USED.some(techUsed => techUsed.test(techEntered))) {
                        socket.emit('tech unsure', 'We\'re not sure if we can use this technology, fill out the form below and we\'ll get back to you as soon as we can, so we can discuss other options.');
                        botTalks = false;
                      }
                      else {
                        socket.emit('chat message', response.body.result.fulfillment.speech);
                      }
                    });
                    isTechChecked = true;
                  }
                  else {
                    socket.emit('chat message', response.body.result.fulfillment.speech);
                  }
                }

                // if budget has not been checked yet, then check it
                else if (!isBudgetChecked) {
                  // check if the budget parameter is present in the context
                  if (context.parameters.budget) {
                    // if budget parameter is set, check it against the $1000 restriction
                    if (Number(context.parameters.budget.amount) < 1000) {
                      // if budget doesn't fit the restriction, output an error message and stop the bot from talking anymore
                      socket.emit('budget error', 'We\'re very sorry but unfortunately we cannot take projects with a budget under $1000. If you are flexible on this amount, please fill out the form below and we will get in touch as soon as we can.');
                      botTalks = false;
                      return;
                    }
                    else {
                      socket.emit('chat message', response.body.result.fulfillment.speech);
                    }
                    isBudgetChecked = true;
                  }
                  else {
                    socket.emit('chat message', response.body.result.fulfillment.speech);
                  }
                }
                else {
                  socket.emit('chat message', response.body.result.fulfillment.speech);
                }
              }
            }
          });
        });
    }
  })
});

// f(obj, arrayOfKeys) {
//   check keys, left to right, and find if they exist in the obj
// }


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
