var express = require('express');
var bodyParser = require('body-parser');
const session = require('express-session');
var database = require('../database/index.js');
var config = require('./config.js');
const passport = require('passport');
const flash = require('connect-flash');
const transporter = require('../config/mailconfig');
const cloudinary = require('cloudinary');
var nodemailer = require('nodemailer');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const settings = require('./../config/.cloudinary.js');


var app = express();
const router = express.Router();

var stripe = require('stripe')(
  config.config
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

cloudinary.config(settings);

app.post('/api/cloudinaryUpload', upload.single('newfile'), (req, res) => {
  cloudinary.uploader.upload_stream((result) => {
    res.status(200).send(result);
  }).end(req.file.buffer);
});

app.post('/charge', function(req, res) {
  var currentTransaction = {
    'date': new Date,
    'buyer': req.body.user.local.username,
    'seller': req.body.data.seller,
    'item': req.body.data.item,
    'cost': req.body.data.cost
  };
  console.log('ct in server', currentTransaction);
  database.createTransaction(currentTransaction, (err, newTrans) => {
    if (err) { console.log(err); } else { res.send(newTrans); }
  });
  stripe.charges.create({
    amount: req.body.data.cost * 100,
    currency: 'usd',
    source: req.body.data.token.id,
    description: 'Charge for anon user'
  }, function(err, charge) {
    if (err) {
      console.error(err);
      res.end();
    } else {
      transporter.transporter.sendMail({
        from: 'blacksmithpostroanl@gmail.com',
        to: req.body.data.seller,
        subject: 'Your item sold on Blacksmith Post!',
        text: 'Great smithing! Your item ' + req.body.data.item + ' sold for $' + req.body.data.cost + ' on Blacksmith Post!'
      }, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Seller email sent: ' + info.response);
        }
      });
      transporter.transporter.sendMail({
        from: 'blacksmithpostroanl@gmail.com',
        to: req.body.user.local.username,
        subject: 'Your Blacksmith Post Purchase',
        text: 'Thanks for your patronage, good fellow! ' + req.body.data.item + ' is yours for the fair price of $' + req.body.data.cost + '! Look for the smithy to get in touch with you soon for shipping details.'
      }, function(error, info) {
        if (error) {
          console.log(error);
          res.end();
        } else {
          console.log('Buyer email sent: ' + info.response);
          res.writeHead(200);
          res.end();
        }
      });
    }
  }
  );
});

app.get('/signupS', function(req, res) {
  res.send(req.flash('User'));
});

app.get('/signupF', function(req, res) {
  res.send({message: req.flash('signupMessage')});
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/signupS',
  failureRedirect: '/signupF',
  failureFlash: true,
  successFlash: true
}));

app.get('/loginS', function(req, res) {
  res.send(req.flash('User'));
});

app.get('/loginF', function(req, res) {
  res.send({message: req.flash('loginMessage')});
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

app.post('/userFeedback', function(req, res) {
  database.addFeedback(req.body, (data) => {
    console.log(data)
  })
})

app.get('/userFeedback', function(req, res) {
  database.getFeedback(req.query.username, (data) => {
    let ending = {};
    if (data) {

      if (data.feedback.length > 0) {
        ending.feedback = data.feedback;
      }
      if (data.rating.length > 0) {
        ending.rating = data.rating
      }
      res.json(ending)
    }
    })

})

app.get('/userSells', function(req, res) {
  //res.setHeader('Content-Type', 'application/json')
  database.getSells(req.query.username, (data) => {
    if (data.length > 0) {
      res.json({sells: data});
    }
  });
});

app.get('/userBuys', function(req, res) {
  database.getBuys(req.query.username, (data) => {
    if (data.length > 0) {
      res.json({buys: data});
    }
  });
});
app.get('/userCurrentItems', function(req, res) {
  database.getCurrentItems(req.query.username, (data) => {
    if (data.length > 0) {
      res.json({currentItems: data});
    }
  });
});

//request to view all items of type
app.get('/api/items', function (req, res) {
  database.allItems(function (err, data) {
    if (err) {
      res.sendStatus(500 + 'cant find item');
    } else {
      res.json(data);
    }
  });
});

//request to add item to database
app.post('/api/itemForm', function (req, res) {
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
  database.deleteItem(req.body);
  res.end();
});
