(function () {
  'use strict';

  angular
    .module('invoices.services')
    .factory('ModalInvoice', ModalInvoiceService);

  ModalInvoiceService.$inject = ['$uibModal', '$rootScope'];

  function ModalInvoiceService($uibModal, $rootScope) {

    var ModalInvoice = {};

    ModalInvoice.open = function (invoice) {
      $rootScope.invoice = invoice;
      return $uibModal.open({
        templateUrl: 'modules/invoices/client/views/admin/modal-invoice.html',
        controllerAs: 'modal',
        controller: 'ModalInvoiceController',
        size: 'md'
      });
    };

    return ModalInvoice;

  }

}());
