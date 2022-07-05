const express = require('express');
const arj = require('api-response-json')
const router = express.Router();
const fs = require('fs');
const ProductSchema = require('../schema/product.schema');
const UserSchema = require('../schema/user.schema');
const RecheckToken = require('../utils/RecheckToken');



router.get('/products', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              ProductSchema.find()
                                    .exec(function (error, product_schema) {
                                          if (error) {
                                                return next(error);
                                          } else {
                                                if (product_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      arj.ok(res, true, 'Product Api successfully!', { result: product_schema })
                                                }
                                          }
                                    });
                        }
                  }
            });
      }).catch(err => {
            ProductSchema.find()
                  .exec(function (error, product_schema) {
                        if (error) {
                              return next(error);
                        } else {
                              if (product_schema === null) {
                                    arj.badRequest(res, false, error.message, { result: null });
                              } else {
                                    arj.ok(res, true, 'Product Api successfully!', { result: product_schema })
                              }
                        }
                  });
      })



});

router.get('/product/:id', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              ProductSchema.find({ _id: req.params.id })
                                    .exec(function (error, product_schema) {
                                          if (error) {
                                                return next(error);
                                          } else {
                                                if (product_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      arj.ok(res, true, 'Product Api successfully!', { result: product_schema })
                                                }
                                          }
                                    });
                        }
                  }
            });
      }).catch(err => {
            ProductSchema.find({ _id: req.params.id })
                  .exec(function (error, product_schema) {
                        if (error) {
                              return next(error);
                        } else {
                              if (product_schema === null) {
                                    arj.badRequest(res, false, error.message, { result: null });
                              } else {
                                    arj.ok(res, true, 'Product Api successfully!', { result: product_schema })
                              }
                        }
                  });
      })


})


router.post('/add-product', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              if (req.body.image) {
                                    let ext = req.body.image.base64.split(';')[0].match(/jpeg|png|gif/)[0];
                                    let data = req.body.image.base64.replace(/^data:image\/\w+;base64,/, "");
                                    let buf = new Buffer(data, 'base64');
                                    fs.writeFile("public/images/products/" + req.body._id + "." + ext, buf, { encoding: 'base64' }, function (err) {
                                          console.log('File created');
                                    });

                                    req.body.image = { url: "images/products/" + req.body._id + "." + ext };

                              }

                              let data = new ProductSchema({
                                    _id: req.body._id,
                                    price: req.body.peice,
                                    name: req.body.name,
                                    image: req.body.image,
                                    description: req.body.description,
                                    sid: req.body.sid,
                              })
                              data.save(function (error, product_schema) {
                                    if (error) {
                                          console.log(error);
                                          arj.badRequest(res, false, error.message, { result: null });
                                    } else {
                                          arj.created(res, true, 'Create Product Api successfully!', { result: product_schema });

                                    }

                              })
                        }
                  }
            });
      })

})

router.put('/update-product', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              if (req.body.image) {
                                    if (req.body.image.base64) {
                                          let ext = req.body.image.base64.split(';')[0].match(/jpeg|png|gif/)[0];
                                          let data = req.body.image.base64.replace(/^data:image\/\w+;base64,/, "");
                                          let buf = new Buffer(data, 'base64');

                                          fs.writeFile("public/images/products/" + req.params.id + "." + ext, buf, { encoding: 'base64' }, function (err) {
                                                console.log('File created');
                                          });

                                          req.body.image = { url: "images/products/" + req.params.id + "." + ext };
                                    }
                              }

                              const Update = ProductSchema.where({ _id: req.params.id });
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


})

router.delete('/delete-product', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              ProductSchema.remove({ _id: req.params.id })
                                    .exec()
                                    .then(product_schema => {



                                          fs.unlink("public/images/products/" + req.params.id + "." + ext, function (err) {
                                                if (err) {
                                                      console.log('not File');
                                                } else {
                                                      console.log('File deleted!');
                                                };
                                          });


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


})



module.exports = router;