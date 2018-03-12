var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/blacksmith');

var db = mongoose.connection;

db.on('error', function () {
  console.log('mongoose connection error');
});

db.once('open', function () {
  console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  name: String,
  description: String,
  category: String,
  subcategory: String,
  cost: Number,
  email: String,
  condition: String,
  blacksmith: String,
  material: String,
  image: String,
  class: String,
  subclass: String,
  active: Boolean
});

const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String
  },
  rating: [
    {
      user: String,
      rating: Number
    }
  ],
  feedback: [
    {
      date: {type: Date, default: Date.now},
      user: String,
      message: String
    }
  ]
},
{
  usePushEach: true
});



const User = mongoose.model('User', userSchema);

const transactionSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  buyer: String,
  seller: String,
  item: String,
  cost: Number
});

const Transaction = mongoose.model('Transaction', transactionSchema);

var createTransaction = function(data, cb) {
  new Transaction({
    'date': data.date,
    'buyer': data.buyer,
    'seller': data.seller,
    'item': data.item,
    'cost': data.cost
  }).save((err, newTrans) => {
    if (err) { return cb(err); }
    cb(null, newTrans);
  });
};

var item = module.exports = mongoose.model('item', itemSchema);

//create a item listing
var createItem = function (data, cb) {
  new item({
    name: data.name || 'greatHelm',
    description: data.description || 'from the swamp of mordor',
    category: data.category || 'weapon',
    subcategory: data.subcategory || 'sword',
    cost: data.cost || 999999,
    email: data.email || 'gandalf8037052@hotmail.com',
    condition: data.condition || 'Pristine',
    blacksmith: data.blacksmith || 'Hattori Hanzo',
    material: data.material || 'Dragonsteel',
    image: data.image || 'picture',
    class: data.class || 'weapon or armor',
    active: true
  }).save((err, newItem) => {
    if (err) { return cb(err); }
    cb(null, newItem);
  });
};

var getSells = function(data, cb) {
  Transaction.find({seller: data}, function(err, info) {
    if (err) { console.log(err); }
    cb(info);
  });
};

var getBuys = function(data, cb) {
  Transaction.find({buyer: data}, function(err, info) {
    if (err) { console.log(err); }
    cb(info);
  });
};
var getCurrentItems = function(data, cb) {
  item.find({email: data}, function(err, info) {
    if (err) { console.log(err); }
    cb(info);
  });
};

// find all weapons
var allItems = function(callback) {
  //weapon.find takes 200 years
  //database is releated to async, across network async
  item.find(function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);

    }
  }).limit(200);
};

var getFeedback = function(data, cb) {
  User.findOne({'local.username': data}, function(err, info) {
    if (err) {console.log(err);}
    cb(info)
  });
};

var addFeedback = function(data, cb) {
  if (data.rating.rating != '') {
    User.findOne({'local.username': data.username}, function(err, info) {
      if (err) {console.log('ERR in dbsave', err);}
      info.rating.push(data.rating);
      info.save(cb)

      //   function(err) {
      //   if (err) {console.log('ERR IN DBSAVE', err);}
      // });
      // console.log(info)
      // cb('updated : ', info);
    })
  }
  if (data.feedback.message != '') {
    User.findOne({'local.username': data.username}, function(err, info) {
      if (err) {console.log('ERR in dbsave', err);}
      info.feedback.push(data.feedback);
      info.save(cb)

      //   function(err) {
      //   if(err){console.log('ERR IN DBSAVE', err);}
      // });
      // console.log(info)
      // cb('updated : ', info);
    })
  };
}

var deleteItem = function(data) {
  item.remove({name: data.name})
};

//search for item by type
var findItem = function(data, callback) {
  item.findOne({'name': data.name}).exec(callback);
};

// exports.findAll
module.exports.deleteItem = deleteItem;
module.exports.allItems = allItems;
module.exports.createItem = createItem;
module.exports.findItem = findItem;
module.exports.User = User;
module.exports.createTransaction = createTransaction;
module.exports.getBuys = getBuys;
module.exports.getCurrentItems = getCurrentItems;
module.exports.getSells = getSells;
module.exports.getFeedback = getFeedback;
module.exports.addFeedback = addFeedback;
