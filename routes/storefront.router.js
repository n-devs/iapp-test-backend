const express = require('express');
const arj = require('api-response-json')
const router = express.Router();
const fs = require('fs');
const StoreFrontSchema = require('../schema/storefront.schema');
const UserSchema = require('../schema/user.schema');
const RecheckToken = require('../utils/RecheckToken');

router.get('/storefront', (req, res, next) => {
      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              StoreFrontSchema.find()
                                    .exec(function (error, storefront_schema) {
                                          if (error) {
                                                return next(error);
                                          } else {
                                                if (storefront_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      arj.ok(res, true, 'StoreFront Api successfully!', { result: storefront_schema })
                                                }
                                          }
                                    });
                        }
                  }
            });
      }).catch(err => {
            StoreFrontSchema.find()
                  .exec(function (error, storefront_schema) {
                        if (error) {
                              return next(error);
                        } else {
                              if (storefront_schema === null) {
                                    arj.badRequest(res, false, error.message, { result: null });
                              } else {
                                    arj.ok(res, true, 'StoreFront Api successfully!', { result: storefront_schema })
                              }
                        }
                  });
      })


});

router.get('/storefront/:id', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {
                              StoreFrontSchema.find({ _id: req.params.id })
                                    .exec(function (error, storefront_schema) {
                                          if (error) {
                                                return next(error);
                                          } else {
                                                if (storefront_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      arj.ok(res, true, 'StoreFront Api successfully!', { result: storefront_schema })
                                                }
                                          }
                                    });
                        }
                  }
            });
      }).catch(err => {
            StoreFrontSchema.find({ _id: req.params.id })
                  .exec(function (error, storefront_schema) {
                        if (error) {
                              return next(error);
                        } else {
                              if (storefront_schema === null) {
                                    arj.badRequest(res, false, error.message, { result: null });
                              } else {
                                    arj.ok(res, true, 'StoreFront Api successfully!', { result: storefront_schema })
                              }
                        }
                  });
      })


})


router.post('/add-storefront', (req, res, next) => {

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
                                    fs.writeFile("public/images/storefront/" + req.body._id + "." + ext, buf, { encoding: 'base64' }, function (err) {
                                          console.log('File created');
                                    });

                                    req.body.image = { url: "images/storefront/" + req.body._id + "." + ext };

                              }

                              let data = new StoreFrontSchema({
                                    _id: req.body._id,
                                    image: req.body.image,
                                    description: req.body.description,
                                    owner: req.body.owner,
                              })
                              data.save(function (error, storefront_schema) {
                                    if (error) {
                                          console.log(error);
                                          arj.badRequest(res, false, error.message, { result: null });
                                    } else {
                                          arj.created(res, true, 'Create StoreFront Api successfully!', { result: storefront_schema });

                                    }

                              })
                        }
                  }
            });
      })


})

router.put('/update-storefront', (req, res, next) => {

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

                                          fs.writeFile("public/images/storefront/" + req.params.id + "." + ext, buf, { encoding: 'base64' }, function (err) {
                                                console.log('File created');
                                          });

                                          req.body.image = { url: "images/storefront/" + req.params.id + "." + ext };
                                    }
                              }

                              const Update = StoreFrontSchema.where({ _id: req.params.id });
                              Update.update(req.body)
                                    .exec(function (error, storefront_schema) {
                                          if (error) {
                                                return arj.badRequest(error, res, { result: null });
                                          } else {
                                                if (storefront_schema === null) {
                                                      arj.badRequest(res, false, error.message, { result: null });
                                                } else {
                                                      arj.ok(res, true, 'StoreFront Api successfully!', { result: storefront_schema })
                                                      console.log(storefront_schema);

                                                }
                                          }
                                    });
                        }
                  }
            });
      })


})

router.delete('/delete-storefront', (req, res, next) => {

      RecheckToken(req).then(token => {
            UserSchema.findById(token.user._id).exec(function (error, user) {
                  if (error) {
                        return next(error);
                  } else {
                        if (user === null) {
                              arj.unauthorized(res, false, 'You are not logged in', { result: null });
                              console.log(user);
                        } else {

                              StoreFrontSchema.remove({ _id: req.params.id })
                                    .exec()
                                    .then(storefront_schema => {



                                          fs.unlink("public/images/storefront/" + req.params.id + "." + ext, function (err) {
                                                if (err) {
                                                      console.log('not File');
                                                } else {
                                                      console.log('File deleted!');
                                                };
                                          });


                                          arj.ok(res, true, 'Delete successfully!', { result: storefront_schema })
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