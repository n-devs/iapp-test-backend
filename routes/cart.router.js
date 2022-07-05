const express = require('express');
const arj = require('api-response-json')
const CartSchema = require('../schema/cart.schema');
const ProductSchema = require('../schema/product.schema');

const router = express.Router();

router.get('/cart', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              CartSchema.find({ owner: req.session.userId })
                                    .exec(function (error, cart_schema) {
                                          if (error) {
                                                return next(error);
                                          } else {
                                                if (cart_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      ProductSchema.findById(cart_schema.pid).exec(function (error, product_schema) {
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

router.put('/cart', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              const Update = CartSchema.where({ _id: req.params.id });
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

router.post('/cart', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              let data = new CartSchema({
                                    _id: req.body._id,
                                    pid: req.body.pid,
                                    uid: req.body.uid,
                              })
                              data.save(function (error, cart_schema) {
                                    if (error) {
                                          console.log(error);
                                          arj.badRequest(res, false, error.message, { result: null });
                                    } else {
                                          arj.created(res, true, 'Create Cart Api successfully!', { result: cart_schema });

                                    }

                              })
                        }
                  }
            });
      })


});

router.delete('/cart', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              CartSchema.remove({ _id: req.params.id })
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