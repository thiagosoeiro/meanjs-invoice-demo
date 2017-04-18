(function () {
  'use strict';

  angular
    .module('invoices.services')
    .factory('InvoicesService', InvoicesService);

  InvoicesService.$inject = ['$resource', '$log'];

  function InvoicesService($resource, $log) {
    var Invoice = $resource('/api/invoices/:invoiceId', {
      invoiceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Invoice.prototype, {
      createOrUpdate: function () {
        var invoice = this;
        return createOrUpdate(invoice);
      }
    });

    return Invoice;

    function createOrUpdate(invoice) {
      if (invoice._id) {
        return invoice.$update(onSuccess, onError);
      } else {
        return invoice.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(invoice) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
