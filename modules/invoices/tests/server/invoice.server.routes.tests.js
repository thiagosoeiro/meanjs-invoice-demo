'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Invoice = mongoose.model('Invoice'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  invoice;

/**
 * Invoice routes tests
 */
describe('Invoice CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new invoice
    user.save(function () {
      invoice = {
        title: 'Invoice Title',
        content: 'Invoice Content',
        number: 'invoice number',
        senderName: 'Sender name',
        senderEmail: 'sender@sender.com',
        receiverName: 'receiver name',
        receiverEmail: 'receiver@receiver.com',
        paymentTerms: 'payment terms',
        amountPaid: 10
      };

      done();
    });
  });

  it('should not be able to save an invoice if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/invoices')
          .send(invoice)
          .expect(403)
          .end(function (invoiceSaveErr, invoiceSaveRes) {
            // Call the assertion callback
            done(invoiceSaveErr);
          });

      });
  });

  it('should not be able to save an invoice if not logged in', function (done) {
    agent.post('/api/invoices')
      .send(invoice)
      .expect(403)
      .end(function (invoiceSaveErr, invoiceSaveRes) {
        // Call the assertion callback
        done(invoiceSaveErr);
      });
  });

  it('should not be able to update an invoice if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/invoices')
          .send(invoice)
          .expect(403)
          .end(function (invoiceSaveErr, invoiceSaveRes) {
            // Call the assertion callback
            done(invoiceSaveErr);
          });
      });
  });

  it('should be able to get a list of invoices if not signed in', function (done) {
    // Create new invoice model instance
    var invoiceObj = new Invoice(invoice);

    // Save the invoice
    invoiceObj.save(function () {
      // Request invoices
      request(app).get('/api/invoices')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single invoice if not signed in', function (done) {
    // Create new invoice model instance
    var invoiceObj = new Invoice(invoice);

    // Save the invoice
    invoiceObj.save(function () {
      request(app).get('/api/invoices/' + invoiceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', invoice.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single invoice with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/invoices/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Invoice is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single invoice which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent invoice
    request(app).get('/api/invoices/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No invoice with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an invoice if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/invoices')
          .send(invoice)
          .expect(403)
          .end(function (invoiceSaveErr, invoiceSaveRes) {
            // Call the assertion callback
            done(invoiceSaveErr);
          });
      });
  });

  it('should not be able to delete an invoice if not signed in', function (done) {
    // Set invoice user
    invoice.user = user;

    // Create new invoice model instance
    var invoiceObj = new Invoice(invoice);

    // Save the invoice
    invoiceObj.save(function () {
      // Try deleting invoice
      request(app).delete('/api/invoices/' + invoiceObj._id)
        .expect(403)
        .end(function (invoiceDeleteErr, invoiceDeleteRes) {
          // Set message assertion
          (invoiceDeleteRes.body.message).should.match('User is not authorized');

          // Handle invoice error error
          done(invoiceDeleteErr);
        });

    });
  });

  // it('should be able to get a single invoice that has an orphaned user reference', function (done) {
  //   // Create orphan user creds
  //   var _creds = {
  //     usernameOrEmail: 'orphan',
  //     password: 'M3@n.jsI$Aw3$0m3'
  //   };

  //   // Create orphan user
  //   var _orphan = new User({
  //     firstName: 'Full',
  //     lastName: 'Name',
  //     displayName: 'Full Name',
  //     email: 'orphan@test.com',
  //     username: _creds.usernameOrEmail,
  //     password: _creds.password,
  //     provider: 'local',
  //     roles: ['admin']
  //   });

  //   _orphan.save(function (err, orphan) {
  //     // Handle save error
  //     if (err) {
  //       return done(err);
  //     }

  //     agent.post('/api/auth/signin')
  //       .send(_creds)
  //       .expect(200)
  //       .end(function (signinErr, signinRes) {
  //         // Handle signin error
  //         if (signinErr) {
  //           return done(signinErr);
  //         }

  //         // Get the userId
  //         var orphanId = orphan._id;

  //         // Save a new invoice
  //         agent.post('/api/invoices')
  //           .send(invoice)
  //           .expect(200)
  //           .end(function (invoiceSaveErr, invoiceSaveRes) {
  //             // Handle invoice save error
  //             if (invoiceSaveErr) {
  //               return done(invoiceSaveErr);
  //             }

  //             // Set assertions on new invoice
  //             (invoiceSaveRes.body.title).should.equal(invoice.title);
  //             should.exist(invoiceSaveRes.body.user);
  //             should.equal(invoiceSaveRes.body.user._id, orphanId);

  //             // force the invoice to have an orphaned user reference
  //             orphan.remove(function () {
  //               // now signin with valid user
  //               agent.post('/api/auth/signin')
  //                 .send(credentials)
  //                 .expect(200)
  //                 .end(function (err, res) {
  //                   // Handle signin error
  //                   if (err) {
  //                     return done(err);
  //                   }

  //                   // Get the invoice
  //                   agent.get('/api/invoices/' + invoiceSaveRes.body._id)
  //                     .expect(200)
  //                     .end(function (invoiceInfoErr, invoiceInfoRes) {
  //                       // Handle invoice error
  //                       if (invoiceInfoErr) {
  //                         return done(invoiceInfoErr);
  //                       }

  //                       // Set assertions
  //                       (invoiceInfoRes.body._id).should.equal(invoiceSaveRes.body._id);
  //                       (invoiceInfoRes.body.title).should.equal(invoice.title);
  //                       should.equal(invoiceInfoRes.body.user, undefined);

  //                       // Call the assertion callback
  //                       done();
  //                     });
  //                 });
  //             });
  //           });
  //       });
  //   });
  // });

  // it('should be able to get a single invoice if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
  //   // Create new invoice model instance
  //   var invoiceObj = new Invoice(invoice);

  //   // Save the invoice
  //   invoiceObj.save(function () {
  //     request(app).get('/api/invoices/' + invoiceObj._id)
  //       .end(function (req, res) {
  //         // Set assertion
  //         res.body.should.be.instanceof(Object).and.have.property('title', invoice.title);
  //         // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
  //         res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
  //         // Call the assertion callback
  //         done();
  //       });
  //   });
  // });

  // it('should be able to get single invoice, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
  //   // Create temporary user creds
  //   var _creds = {
  //     usernameOrEmail: 'invoiceowner',
  //     password: 'M3@n.jsI$Aw3$0m3'
  //   };

  //   // Create user that will create the Invoice
  //   var _invoiceOwner = new User({
  //     firstName: 'Full',
  //     lastName: 'Name',
  //     displayName: 'Full Name',
  //     email: 'temp@test.com',
  //     username: _creds.usernameOrEmail,
  //     password: _creds.password,
  //     provider: 'local',
  //     roles: ['admin', 'user']
  //   });

  //   _invoiceOwner.save(function (err, _user) {
  //     // Handle save error
  //     if (err) {
  //       return done(err);
  //     }

  //     // Sign in with the user that will create the Invoice
  //     agent.post('/api/auth/signin')
  //       .send(_creds)
  //       .expect(200)
  //       .end(function (signinErr, signinRes) {
  //         // Handle signin error
  //         if (signinErr) {
  //           return done(signinErr);
  //         }

  //         // Get the userId
  //         var userId = _user._id;

  //         // Save a new invoice
  //         agent.post('/api/invoices')
  //           .send(invoice)
  //           .expect(200)
  //           .end(function (invoiceSaveErr, invoiceSaveRes) {
  //             // Handle invoice save error
  //             if (invoiceSaveErr) {
  //               return done(invoiceSaveErr);
  //             }

  //             // Set assertions on new invoice
  //             (invoiceSaveRes.body.title).should.equal(invoice.title);
  //             should.exist(invoiceSaveRes.body.user);
  //             should.equal(invoiceSaveRes.body.user._id, userId);

  //             // now signin with the test suite user
  //             agent.post('/api/auth/signin')
  //               .send(credentials)
  //               .expect(200)
  //               .end(function (err, res) {
  //                 // Handle signin error
  //                 if (err) {
  //                   return done(err);
  //                 }

  //                 // Get the invoice
  //                 agent.get('/api/invoices/' + invoiceSaveRes.body._id)
  //                   .expect(200)
  //                   .end(function (invoiceInfoErr, invoiceInfoRes) {
  //                     // Handle invoice error
  //                     if (invoiceInfoErr) {
  //                       return done(invoiceInfoErr);
  //                     }

  //                     // Set assertions
  //                     (invoiceInfoRes.body._id).should.equal(invoiceSaveRes.body._id);
  //                     (invoiceInfoRes.body.title).should.equal(invoice.title);
  //                     // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
  //                     (invoiceInfoRes.body.isCurrentUserOwner).should.equal(false);

  //                     // Call the assertion callback
  //                     done();
  //                   });
  //               });
  //           });
  //       });
  //   });
  // });

  afterEach(function (done) {
    User.remove().exec(function () {
      Invoice.remove().exec(done);
    });
  });
});
