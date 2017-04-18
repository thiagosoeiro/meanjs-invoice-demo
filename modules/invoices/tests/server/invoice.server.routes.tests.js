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

  afterEach(function (done) {
    User.remove().exec(function () {
      Invoice.remove().exec(done);
    });
  });
});
