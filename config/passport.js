const LocalStrategy = require('passport-local').Strategy;

const User = require('../database/index.js').User;

module.exports = passport => {
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  });
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      cb(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    username: "username",
    password: "password",
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    process.nextTick(() => {
      User.findOne({'local.username': username}, (err, user) => {
        if (err) return cb(err);
        if (user) return cb(null, false, req.flash('signupMessage', 'Email already taken'));
        else {
          let newUser = new User();
          newUser.local.username = username;
          newUser.local.password = password;
          newUser.save(err => {
            if (err) console.log('hit err in newuser save', err);
            console.log(newUser);
            return cb(null, newUser, req.flash('User', newUser));
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    username: "username",
    password: "password",
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    process.nextTick(() => {
      User.findOne({'local.username': username}, (err, user) => {
        if (err) return cb(err);
        if (!user) return cb(null, false, req.flash('loginMessage', 'User not found'));
        if (user.local.password !== password) return cb(null, false, req.flash('loginMessage', 'Incorrect Password'));
        console.log('login success', user);
        return cb(null, user, req.flash('User', user));
      });
    });
  }));
};
