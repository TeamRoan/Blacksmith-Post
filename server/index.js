var express = require('express');
var bodyParser = require('body-parser');
const session = require('express-session');
var database = require('../database/index.js');
var config = require('./config.js')
const passport = require('passport');
const flash = require('connect-flash');
const sendMail = require('../config/mailconfig');
const cloudinary = require('cloudinary');

var app = express();

var stripe = require('stripe')(
  config.api
);
//to view data in body of api calls
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/../client/dist'));

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});

app.use(session({
  secret: 'Is Will Smith a blacksmith?', //omfg lol
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./../config/passport.js')(passport);

// cloudinary.config({
//   cloud_name: 'hdyuqy7w6',
//   api_key: '687366632423641',
//   api_secret: 'Dv87E7g1IsslPhHnmFwUKSu6fO0'
// });

// app.get('/signup', (req, res) => {
//   res.render('signup.ejs', {message: req.flash('signupMessage')});
// });

app.post('/charge', function(req, res) {
  console.log(req.body.id);
  stripe.charges.create({
    amount: .09,
    currency: 'usd',
    source: req.body.id,
    description: 'Charge for anon user'
  }, function(err, charge) {
    if (err) {
      console.error(err);
      res.end();
    } else {
      console.log('Charged successfully');
      res.writeHead(200);
      res.end(charge);
    }
  });
});

app.get('/signupS', function(req, res) {
  res.send(req.flash('User'))
});

app.get('/signupF', function(req, res) {
  res.send({message: req.flash('signupMessage')})
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/signupS',
  failureRedirect: '/signupF',
  failureFlash: true,
  successFlash: true
}));

app.get('/loginS', function(req, res) {
  res.send(req.flash('User'))
});

app.get('/loginF', function(req, res) {
  res.send({message: req.flash('loginMessage')})
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/loginS',
  failureRedirect: '/loginF',
  failureFlash: true,
  successFlash: true
}));

app.get('/logout', function(req, res) {
  console.log('logout hit');
  req.logout();
  res.redirect('/');
});

//request to view all items of type
app.get('/api/items', function (req, res) {
  database.allItems(function (err, data) {
    if (err) {
      res.sendStatus(500 +'cant find item');
    } else {
      res.json(data);
    }
  });
});

//request to add item to database
app.post('/api/itemForm', function (req, res) {
  // console.log('in server');
  // let newItem = req.body;
  // let filename = req.body.image.split('\\')[2];
  // // console.log(filename);
  // cloudinary.uploader.upload(filename, result => {
  //   console.log(result);
  // })
  // console.log(req.body);
  database.createItem(req.body, (err, newItem) => {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      res.status(200).send(newItem);
    }
  });
});

//api call to delete a item not in use but works
app.post('/api/deleteItem', function (req, res) {
  console.log(req.body.type +" req body delete");
  database.deleteItem(req.body);
});

app.post('/buy', function(req, res) {
  var thing = sendMail;
  res.end();
})
