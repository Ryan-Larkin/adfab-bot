'use strict';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const apiai = require('apiai')('2849dfafec2a4452a8c5c4a15813b072');
const superagent = require('superagent');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}));
// my bot key: 2849dfafec2a4452a8c5c4a15813b072
// zach's bot key: 59b95837db154de18eb3f00d765e7b24
// zachs new bot key: 26fa5ee6713e48babb0fb42de7ef4632
const API_CLIENT_KEY = '26fa5ee6713e48babb0fb42de7ef4632';

const TECHNOLOGIES_USED = [/angular/i, /angular.?js/i, /react.?js/i, /react/i, /react.?native/i, /swift/i, /objective.?c/i, /java.?script/i, /word.?press/i, /woo.?commerce/i,
/prestashop/i, /magento/i, /abe/i, /html/i, /css/i, /java/i, /android/i, /apache.?cordova/i, /node.?js/i, /node/i, /php/i, /symfony/i,
/zend/i, /laravel/i, /drupal/i, /meteor/i, /express/i, /j.?query/i, /unity/i, /vr/i, /virtual.?reality/i, /augmented.?reality/i,
/phone.?gap/i];

const TECHNOLOGIES_NOT_USED = [/shopify/i, /c.?sharp/i, /visual.?basic/i, /cobol/i, /ruby/i];

const E_COMM_TECH = [/magento/i, /prestashop/i, /word.?press/i, /woo.?commerce/i];

const WEB_APP_TECH = [/angular/i, /angular.?js/i, /react.?js/i, /react/i, /node.?js/i, /node/i, /php/i,
                      /word.?press/i, /drupal/i];

const MOBILE_TECH = [/react.?native/i, /swift/i, /objective.?c/i, /java/i];

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
 let log = JSON.parse(req.body.log)
  console.log(log)
  console.log(log.progressType)
  let botConvoEmail = {
      from: '"Ryan" <ryan.r.larkin@gmail.com>',
      to: 'g.bibeaulaviolette@gmail.com',
      subject: 'Test Form Submit',
      text: 'Hello world',
      html: `
        <5>Fab has a new lead for you<5>
         <ul>
           <li>Last Name : ${log.lastName}</li>
           <li>Phone Number : ${log.phoneNumber}</li>
           <li>email : ${log.email}</li>
           <li>Company : ${log.company}</li>
           <li>City : ${log.city}</li>
           <li>Project Type : ${log.projectType}</li>
           <li>State of the project : ${log.progressType}</li>
           <li>Budget : ${log.budget}</li>
           <li>technologies : ${log.technologies}</li>
           <li>deadline : ${log.deadline}</li>
         </ul>`

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
  // using a custom welcome event made in API.ai
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
  let isTyping = true;

  socket.on('chat message', (msg) => {
    if (botTalks) {
      socket.emit('is typing', {isTyping: isTyping});

      setTimeout(function() {
        superagent
        .post(`https://api.api.ai/v1/query?v=${version}`)
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('Authorization', `Bearer ${API_CLIENT_KEY}`)
        .send({query: msg})
        .send({lang: 'en'})
        .send({sessionId: sessionId})
          .then(response => {
            var contextName = response.body.result.contexts.filter(context => {
              return context.name === 'order';
            });
            // to use later to replace the forEach

            response.body.result.contexts.forEach(context => {
              // check for the order context which means an order is in the process of being made
              if (context.name === 'order' && context.parameters) {
                  // always send the context to the front end
                  socket.emit('order context', context.parameters);

                  // if tech has not been checked yet, then check it
                  if (!isTechChecked) {
                    if (context.parameters.technologies && context.parameters.technologies.length) {
                      isTechChecked = true;

                      if (context.parameters.technologies.every(techEntered => TECHNOLOGIES_USED.some(techUsed => techUsed.test(techEntered)))) {
                        socket.emit('chat message', response.body.result.fulfillment.speech);
                        return;
                      }
                      else if (context.parameters.technologies.every(techEntered => TECHNOLOGIES_NOT_USED.some(techNotUsed => techNotUsed.test(techEntered)))) {
                        socket.emit('tech not used', 'We apologize but we cannot use certain technology. If you are flexible on this,' +
                                                       ' please fill out the form below and we\'ll contact you as soon as we can to discuss ' +
                                                       'other options!');
                        botTalks = false;
                        return;
                      }
                      else {
                        socket.emit('tech unsure', 'We\'re not sure if we can use some of this technology, fill out the form below and we\'ll get back' +
                                                     ' to you as soon as we can, so we can discuss other options. We look forward to hearing from you!');
                        botTalks = false;
                        return;
                      }
                    }

                    if (context.parameters['e-comm-tech'] && context.parameters['e-comm-tech'].length) {
                      isTechChecked = true;
                      if (context.parameters['e-comm-tech'].every(techEntered => E_COMM_TECH.some(techUsed => techUsed.test(techEntered)))) {
                        socket.emit('chat message', response.body.result.fulfillment.speech);
                        return;
                      }
                      else if (context.parameters['e-comm-tech'].every(techEntered => TECHNOLOGIES_NOT_USED.some(techNotUsed => techNotUsed.test(techEntered)))) {
                        socket.emit('tech not used', 'We apologize but we cannot use certain technology. If you are flexible on this,' +
                                                       ' please fill out the form below and we\'ll contact you as soon as we can to discuss ' +
                                                       'other options!');
                        botTalks = false;
                        return;
                      }
                      else {
                        socket.emit('tech unsure', 'We\'re not sure if we can use some of this technology, fill out the form below and we\'ll get back' +
                                                     ' to you as soon as we can, so we can discuss other options. We look forward to hearing from you!');
                        botTalks = false;
                        return;
                      }
                    }

                    if (context.parameters['mobile-tech'] && context.parameters['mobile-tech'].length) {
                      isTechChecked = true;
                      if (context.parameters['mobile-tech'].every(techEntered => MOBILE_TECH.some(techUsed => techUsed.test(techEntered)))) {
                        socket.emit('chat message', response.body.result.fulfillment.speech);
                        return;
                      }
                      else if (context.parameters['mobile-tech'].every(techEntered => TECHNOLOGIES_NOT_USED.some(techNotUsed => techNotUsed.test(techEntered)))) {
                        socket.emit('tech not used', 'We apologize but we cannot use certain technology. If you are flexible on this,' +
                                                       ' please fill out the form below and we\'ll contact you as soon as we can to discuss ' +
                                                       'other options!');
                        botTalks = false;
                        return;
                      }
                      else {
                        socket.emit('tech unsure', 'We\'re not sure if we can use some of this technology, fill out the form below and we\'ll get back' +
                                                     ' to you as soon as we can, so we can discuss other options. We look forward to hearing from you!');
                        botTalks = false;
                        return;
                      }
                    }

                    if (context.parameters['web-app-tech'] && context.parameters['web-app-tech'].length) {
                      isTechChecked = true;
                      if (context.parameters['web-app-tech'].every(techEntered => WEB_APP_TECH.some(techUsed => techUsed.test(techEntered)))) {
                        socket.emit('chat message', response.body.result.fulfillment.speech);
                        return;
                      }
                      else if (context.parameters['web-app-tech'].every(techEntered => TECHNOLOGIES_NOT_USED.some(techNotUsed => techNotUsed.test(techEntered)))) {
                        socket.emit('tech not used', 'We apologize but we cannot use certain technology. If you are flexible on this,' +
                                                       ' please fill out the form below and we\'ll contact you as soon as we can to discuss ' +
                                                       'other options!');
                        botTalks = false;
                        return;
                      }
                      else {
                        socket.emit('tech unsure', 'We\'re not sure if we can use some of this technology, fill out the form below and we\'ll get back' +
                                                     ' to you as soon as we can, so we can discuss other options. We look forward to hearing from you!');
                        botTalks = false;
                        return;
                      }
                    }
                  }

                  // if budget has not been checked yet, then check it
                  if (!isBudgetChecked && context.parameters.budget) {
                    isBudgetChecked = true;
                    // if budget parameter is set, check it against the $1000 restriction
                    if (Number(context.parameters.budget.amount) < 1000) {
                      // if budget doesn't fit the restriction, output an error message and stop the bot from talking anymore
                      socket.emit('budget error', 'We\'re very sorry but unfortunately we cannot take projects with a budget under $1000. ' +
                                                    'If you are flexible on this amount, please fill out the form below and we will get in touch ' +
                                                    'as soon as we can.');
                      botTalks = false;
                      return;
                    }
                  }

                  socket.emit('chat message', response.body.result.fulfillment.speech);
              } // end of if context.name === order
            }); // end of .forEach
          }); // end of .then

        isTyping = false;
        socket.emit('is typing', {isTyping: isTyping});
      }, 1500); // end of setTimeout for typing
    } // end of if botTalks
  }); // end of socket.on chat message
}); // end of if socket.on connect

// f(obj, arrayOfKeys) {
//   check keys, left to right, and find if they exist in the obj
// }


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
