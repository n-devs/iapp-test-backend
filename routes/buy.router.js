const express = require('express');
const arj = require('api-response-json')
const BuySchema = require('../schema/buy.schema');
const ProductSchema = require('../schema/product.schema');
const UserSchema = require('../schema/user.schema');
const RecheckToken = require('../utils/RecheckToken');

const router = express.Router();

router.get('/buy', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              BuySchema.find({ owner: req.session.userId })
                                    .exec(function (error, buy_schema) {
                                          if (error) {
                                                return next(error);
                                          } else {
                                                if (buy_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      ProductSchema.findById(buy_schema.pid).exec(function (error, product_schema) {
                                                            if (error) {
                                                                  return next(error);
                                                            } else {
                                                                  if (product_schema === null) {
                                                                        arj.badRequest(res, false, error.message, { result: null });
                                                                  } else {
                                                                        arj.ok(res, true, 'Product Api successfully!', { result: product_schema })
                                                                  }
                                                            }
                                                      })


                                                }
                                          }
                                    });
                        }
                  }
            });
      })


});

router.put('/buy', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              const Update = BuySchema.where({ _id: req.params.id });
                              Update.update(req.body)
                                    .exec(function (error, product_schema) {
                                          if (error) {
                                                return arj.badRequest(error, res, { result: null });
                                          } else {
                                                if (product_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      arj.ok(res, true, 'Product Api successfully!', { result: product_schema })
                                                      console.log(product_schema);

                                                }
                                          }
                                    });
                        }
                  }
            });
      })


});

router.post('/buy', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              let data = new BuySchema({
                                    _id: req.body._id,
                                    pid: req.body.pid,
                                    uid: req.body.uid,
                              })
                              data.save(function (error, buy_schema) {
                                    if (error) {
                                          console.log(error);
                                          arj.badRequest(res, false, error.message, { result: null });
                                    } else {
                                          arj.created(res, true, 'Create Buy Api successfully!', { result: buy_schema });

                                    }

                              })
                        }
                  }
            });
      })


});

router.delete('/buy', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              BuySchema.remove({ _id: req.params.id })
                                    .exec()
                                    .then(product_schema => {

                                          arj.ok(res, true, 'Delete successfully!', { result: product_schema })
                                    })
                                    .catch(error => {
                                          console.log(error);
                                          arj.badRequest(res, false, error.message, { result: null })
                                    });
                        }
                  }
            });
      })

});




module.exports = router;