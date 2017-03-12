(function () {
  'use strict';

  /** @ngInject */
  function ModalInvoiceService($modal, $rootScope) {

    var ModalInvoice = {};

    ModalInvoice.open = function (invoice) {
      $rootScope.invoice = invoice;
      return $modal.open({
        templateUrl: 'modules/invoices/client/views/modal-invoice.html',
        controllerAs: 'modal',
        controller: 'ModalInvoiceController',
        size: 'md'
      });
    };

    return ModalInvoice;

  }

  angular
    .module('invoices')
    .factory('ModalInvoice', ModalInvoiceService);


})();
