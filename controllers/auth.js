import User from '../models/user';
import bodyParser from 'body-parser';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateToken, respond } from '../middleware/authMiddleware';
import response from '../helpers/response';

export default {
  register: async (req, res) => {
    try{
      User.register(
        new User({ 
          username: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        }), req.body.password, function(err, account) {
        if (err) {
          return response.sendError(res, err);
        }

        passport.authenticate(
          'local', {
            session: false
          })(req, res, () => {
          return response.sendOK(res, account);
        });
      });
    }
    catch(err){
      return response.sendError(res, err);
    }
  },

  login: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) {
        return response.sendBadRequest(res, 'Something is not right with your input');
      }
      passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {

          return response.sendBadRequest(res, 'Something is not right with your input');
        }
        req.login(user, {session: false}, (err) => {
          if (err) {
            return response.sendError(res, err);
          }
          // generate a signed son web token with the contents of user object and return it in the return response
          const token = jwt.sign({ id: user.id, email: user.username}, 'ILovePokemon');
          return response.sendOK(res, {user: user.username, token});
        });
      })(req, res);
    }
    catch(err){
      return response.sendError(res, err);
    }
  },

  logout: async (req, res) => {
    req.logout();
    return response.sendOK(res);        
  }
}
