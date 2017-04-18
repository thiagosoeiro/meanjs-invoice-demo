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

  afterEach(function (done) {
    User.remove().exec(function () {
      Invoice.remove().exec(done);
    });
  });
});
