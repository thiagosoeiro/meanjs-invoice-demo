'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Invoice = mongoose.model('Invoice'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),

  nodemailer = require('nodemailer'),
  config = require(path.resolve('./config/config'));

var transporter = nodemailer.createTransport(config.mailer.options);

/**
 * Create an invoice
 */
exports.create = function (req, res) {
  var invoice = new Invoice(req.body);
  invoice.user = req.user;

  invoice.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //send mail
      var mailOptions = {
        to: invoice.receiverEmail,
        from: invoice.senderEmail,
        subject: req.body.subject,
        text: req.body.message,
        html: req.body.message
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        } else {
          res.json(invoice);
        }
      });
      //res.json(invoice);
    }
  });
};

/**
 * Show the current invoice
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var invoice = req.invoice ? req.invoice.toJSON() : {};

  // Add a custom field to the Invoice, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Invoice model.
  invoice.isCurrentUserOwner = !!(req.user && invoice.user && invoice.user._id.toString() === req.user._id.toString());

  res.json(invoice);
};

/**
 * Update an invoice
 */
exports.update = function (req, res) {
  var invoice = req.invoice;

  invoice.title = req.body.title;
  invoice.content = req.body.content;

  invoice.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(invoice);
    }
  });
};

/**
 * Delete an invoice
 */
exports.delete = function (req, res) {
  var invoice = req.invoice;

  invoice.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(invoice);
    }
  });
};

/**
 * List of Invoices
 */
exports.list = function (req, res) {
  Invoice.find().sort('-created').populate('user', 'displayName').exec(function (err, invoices) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(invoices);
    }
  });
};

/**
 * Invoice middleware
 */
exports.invoiceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invoice is invalid'
    });
  }

  Invoice.findById(id).populate('user', 'displayName').exec(function (err, invoice) {
    if (err) {
      return next(err);
    } else if (!invoice) {
      return res.status(404).send({
        message: 'No invoice with that identifier has been found'
      });
    }
    req.invoice = invoice;
    next();
  });
};
