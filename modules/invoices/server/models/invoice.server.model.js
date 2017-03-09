'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');


/**
 * A Validation function for email
 */
var validateEmail = function (email) {
  return (validator.isEmail(email));
};

/**
 * Invoice Schema
 */
var InvoiceSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Invoice title',
    trim: true
  },
  number: {
    type: String,
    default: '',
    required: 'Please fill Invoice number',
    trim: true
  },
  senderName: {
    type: String,
    default: '',
    required: 'Please fill Invoice sender name',
    trim: true
  },
  senderEmail: {
    type: String,
    required: 'Please fill Invoice sender email',
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateEmail, 'Please fill a valid email address']
  },
  receiverName: {
    type: String,
    default: '',
    required: 'Please fill Invoice receiver name',
    trim: true
  },
  receiverEmail: {
    type: String,
    default: '',
    required: 'Please fill Invoice receiver email',
    lowercase: true,
    trim: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  invoiceDueDate: {
    type: Date,
    default: Date.now
  },
  paymentTerms: {
    type: String,
    default: '',
    required: 'Please fill Invoice payment terms',
    trim: true
  },
  balanceDue: {
    type: Number,
    default: '',
    trim: true
  },
  items: [{
    description: {
      type: String,
      default: '',
      required: 'Please fill description field',
      trim: true
    },
    quantity: {
      type: Number,
      default: '',
      required: 'Please fill quantity field',
      trim: true
    },
    rate: {
      type: Number,
      default: '',
      required: 'Please fill rate field',
      trim: true
    },
    amount: {
      type: Number,
      default: '',
      required: 'Please fill amount field',
      trim: true
    }
  }],
  total: {
    type: Number,
    default: '',
    trim: true
  },
  amountPaid: {
    type: Number,
    default: '',
    required: 'Please fill Invoice amount paid',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  terms: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Invoice', InvoiceSchema);
