const express = require('express');
const bcrypt = require('bcrypt');
const arj = require('api-response-json')
const User = require('../schema/user.schema');
const generateAccessToken = require('../utils/generateAccessToken');
const RecheckToken = require('../utils/RecheckToken');
const jwt = require('jsonwebtoken')
const router = express.Router();
const dotenv = require('dotenv');
// get config vars
dotenv.config();



router.post('/register', (req, res, next) => {

      const { firstName, lastName, email, password, passwordConf } = req.body;

      console.log(req.body);
      if (password !== passwordConf) {
            var err = new Error('Passwords do not match.');
            // err.status = 400;
            // res.send("passwords dont match");
            arj.badRequest(res, false, "passwords dont match", { err: err })
            return next(err);
      }

      if (firstName && lastName && email && password && passwordConf) {
            User.find({ email: email })
                  .exec()
                  .then(user => {
                        if (user.length >= 1) {

                              arj.created(res, true, 'Invalid registered CONFLICT ', { result: null });
                        } else {

                              // return res.redirect('/');
                              bcrypt.hash(password, 10, (err, hash) => {
                                    if (err) {
                                          arj.internalServerError(res, false, err.message, { result: null })
                                    }

                                    const user = new User({
                                          firstName: firstName,
                                          lastName: lastName,
                                          email: email,
                                          password: hash
                                    })

                                    console.log(req.body);

                                    user.save()
                                          .then(result => {
                                                req.session.userId = user._id;
                                                console.log(result);
                                                generateAccessToken(user).then(token => {
                                                      req.session.token = token;
                                                      res.set('Authorization', `Bearer ${token}`)
                                                      arj.created(res, true, 'User CREATED successfully!', {
                                                            result: result,
                                                            token: token
                                                      })
                                                }).catch(err => {
                                                      arj.unauthorized(res, false, "err", { err: err })
                                                })

                                          })
                                          .catch(err => {
                                                // console.log(err);
                                                arj.internalServerError(res, false, err.message, { result: null })
                                          });


                              })
                        }
                  });
      }


});

router.post('/login', (req, res, next) => {
      const { email, password } = req.body;
      if (email && password) {
            User.authenticate(email, password, function (error, user) {
                  if (error || !user) {
                        var err = new Error('Wrong email or password.');
                        err.status = 401;
                        arj.unauthorized(res, false, error.message, { result: null })
                        return next(err);
                  } else {
                        req.session.userId = user._id;

                        generateAccessToken(user).then(token => {
                              req.session.token = token;
                              res.set('Authorization', `Bearer ${token}`)
                              arj.ok(res, true, 'User loggedin successfully!', {
                                    result: user,
                                    token: token
                              });
                        }).catch(err => {
                              arj.unauthorized(res, false, "err", { err: err })
                        })

                  }
            });
      } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
      }
});

router.get('/dashboard', (req, res, next) => {
      RecheckToken(req).then(token => {
            console.log(token);
            User.findById(token.user._id)
                  .exec(function (error, user) {
                        if (error) {
                              return next(error);
                        } else {
                              if (user === null) {
                                    arj.unauthorized(res, false, 'You are not logged in', { result: null });
                                    console.log(user);
                              } else {
                                    arj.ok(res, true, 'User loggedin successfully!', {
                                          result: user
                                    })
                                    console.log(user);
                              }
                        }
                  });
      })



});

router.delete('/logout', (req, res, next) => {
      RecheckToken(req).then(data => {
            let token = jwt.sign({ ...data.user }, process.env.TOKEN_SECRET, {
                  expiresIn: '1s'
            })
            if (req.session) {
                  // delete session object
                  req.session.destroy(function (err) {
                        if (err) {
                              // return next(err);
                              arj.unauthorized(res, false, 'You are not delete in', {
                                    result: null,
                                    token: token
                              });
                        } else {
                              arj.ok(res, true, "Delete successfully!", {
                                    result: req,
                                    token: token
                              })
                              // return res.redirect('/');
                        }
                  });
            }
      })

});

module.exports = router;
