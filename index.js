import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';

import config from './config/';
import db from './db/connect';

import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import response from './helpers/response';

import User from './models/user';

const port = process.env.PORT || config.server.port;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false
}));
server.use(passport.initialize());
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'ILovePokemon'
  },
  function (jwtPayload, cb) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findById(jwtPayload.id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
  }
));


server.use(response.setHeadersForCORS);

server.use('/posts', postsRoutes);
server.use('/auth', passport.authenticate('jwt', {session: false}), authRoutes);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});

server.use(function(req, res) {
  response.sendNotFound(res);
});

server.listen(port, () => {
  console.log(`server started : ${port}`);
});

