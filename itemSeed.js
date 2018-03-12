var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/blacksmith');

var db = mongoose.connection;




db.collection('items').drop();



//creates new collection of items with data loated in data.json
var docs = fs.readFile('predata.json', 'utf8', function (err, data) {
  var items = db.collection('items');
  console.log(data)
  items.insert(JSON.parse(data), function (err, docs) {
    items.count(function (err, count) {
      console.log(count + "[" + data + "]");
      db.close();
    });
  });
});

db.collection('transactions').drop();



//creates new collection of items with data loated in data.json
var docs = fs.readFile('transactiondata.json', 'utf8', function (err, data) {
  var transactions = db.collection('transactions');
  console.log(data)
  transactions.insert(JSON.parse(data), function (err, docs) {
    transactions.count(function (err, count) {
      console.log(count + "[" + data + "]");
      db.close();
    });
  });
});

db.collection('users').drop();



//creates new collection of items with data loated in data.json
var docs = fs.readFile('userdata.json', 'utf8', function (err, data) {
  var users = db.collection('users');
  console.log(data)
  users.insert(JSON.parse(data), function (err, docs) {
    users.count(function (err, count) {
      console.log(count + "[" + data + "]");
      db.close();
    });
  });
});
