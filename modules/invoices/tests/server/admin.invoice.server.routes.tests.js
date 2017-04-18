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
describe('Invoice Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new invoice
    user.save(function () {
      invoice = {
        "title": "New Invoice",
        "content": "Content",
        "items": [
          {
            "description": "Product 1",
            "quantity": "10",
            "rate": 2,
            "amount": 20
          },
          {
            "description": "Product 2",
            "quantity": "3",
            "rate": 6,
            "amount": 18
          }
        ],
        "number": "1632",
        "senderName": "Eric",
        "receiverName": "Paul",
        "paymentTerms": "Payments terms",
        "senderEmail": "eric@eric.com",
        "receiverEmail": "paul@paul.com",
        "invoiceDate": "2017/03/01",
        "invoiceDueDate": "2017/03/10",
        "total": 38,
        "balanceDue": 18,
        "amountPaid": 20,
        "notes": "Notes",
        "terms": "Terms",
        "subject": "Invoice from Eric | # 1632",
        "message": "Hi Paul,\nThe following invoice has been created on your account:\nInvoice Number: 1632\nFrom: Eric\nBalance Due: 18\nTotal: 38\nAmount Paid: 20\nNotes: Notes\nTerms: Terms"
      };

      done();
    });
  });

  // it('should be able to save an invoice if logged in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new invoice
  //       agent.post('/api/invoices')
  //         .send(invoice)
  //         .expect(200)
  //         .end(function (invoiceSaveErr, invoiceSaveRes) {
  //           // Handle invoice save error
  //           if (invoiceSaveErr) {
  //             return done(invoiceSaveErr);
  //           }

  //           // Get a list of invoices
  //           agent.get('/api/invoices')
  //             .end(function (invoicesGetErr, invoicesGetRes) {
  //               // Handle invoice save error
  //               if (invoicesGetErr) {
  //                 return done(invoicesGetErr);
  //               }

  //               // Get invoices list
  //               var invoices = invoicesGetRes.body;

  //               // Set assertions
  //               (invoices[0].user._id).should.equal(userId);
  //               (invoices[0].title).should.match('Invoice Title');

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });

  // it('should be able to update an invoice if signed in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new invoice
  //       agent.post('/api/invoices')
  //         .send(invoice)
  //         .expect(200)
  //         .end(function (invoiceSaveErr, invoiceSaveRes) {
  //           // Handle invoice save error
  //           if (invoiceSaveErr) {
  //             return done(invoiceSaveErr);
  //           }

  //           // Update invoice title
  //           invoice.title = 'WHY YOU GOTTA BE SO MEAN?';

  //           // Update an existing invoice
  //           agent.put('/api/invoices/' + invoiceSaveRes.body._id)
  //             .send(invoice)
  //             .expect(200)
  //             .end(function (invoiceUpdateErr, invoiceUpdateRes) {
  //               // Handle invoice update error
  //               if (invoiceUpdateErr) {
  //                 return done(invoiceUpdateErr);
  //               }

  //               // Set assertions
  //               (invoiceUpdateRes.body._id).should.equal(invoiceSaveRes.body._id);
  //               (invoiceUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });

  it('should not be able to save an invoice if no title is provided', function (done) {
    // Invalidate title field
    invoice.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new invoice
        agent.post('/api/invoices')
          .send(invoice)
          .expect(422)
          .end(function (invoiceSaveErr, invoiceSaveRes) {
            // Set message assertion
            (invoiceSaveRes.body.message).should.match('Please fill Invoice title');

            // Handle invoice save error
            done(invoiceSaveErr);
          });
      });
  });

  // it('should be able to delete an invoice if signed in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new invoice
  //       agent.post('/api/invoices')
  //         .send(invoice)
  //         .expect(200)
  //         .end(function (invoiceSaveErr, invoiceSaveRes) {
  //           // Handle invoice save error
  //           if (invoiceSaveErr) {
  //             return done(invoiceSaveErr);
  //           }

  //           // Delete an existing invoice
  //           agent.delete('/api/invoices/' + invoiceSaveRes.body._id)
  //             .send(invoice)
  //             .expect(200)
  //             .end(function (invoiceDeleteErr, invoiceDeleteRes) {
  //               // Handle invoice error error
  //               if (invoiceDeleteErr) {
  //                 return done(invoiceDeleteErr);
  //               }

  //               // Set assertions
  //               (invoiceDeleteRes.body._id).should.equal(invoiceSaveRes.body._id);

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });

  // it('should be able to get a single invoice if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
  //   // Create new invoice model instance
  //   invoice.user = user;
  //   var invoiceObj = new Invoice(invoice);

  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new invoice
  //       agent.post('/api/invoices')
  //         .send(invoice)
  //         .expect(200)
  //         .end(function (invoiceSaveErr, invoiceSaveRes) {
  //           // Handle invoice save error
  //           if (invoiceSaveErr) {
  //             return done(invoiceSaveErr);
  //           }

  //           // Get the invoice
  //           agent.get('/api/invoices/' + invoiceSaveRes.body._id)
  //             .expect(200)
  //             .end(function (invoiceInfoErr, invoiceInfoRes) {
  //               // Handle invoice error
  //               if (invoiceInfoErr) {
  //                 return done(invoiceInfoErr);
  //               }

  //               // Set assertions
  //               (invoiceInfoRes.body._id).should.equal(invoiceSaveRes.body._id);
  //               (invoiceInfoRes.body.title).should.equal(invoice.title);

  //               // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
  //               (invoiceInfoRes.body.isCurrentUserOwner).should.equal(true);

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });

  afterEach(function (done) {
    User.remove().exec(function () {
      Invoice.remove().exec(done);
    });
  });
});
