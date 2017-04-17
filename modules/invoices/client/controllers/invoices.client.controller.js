(function () {
  'use strict';

  angular
    .module('invoices')
    .controller('InvoicesController', InvoicesController);

  InvoicesController.$inject = ['$scope', 'invoiceResolve', 'Authentication'];

  function InvoicesController($scope, invoice, Authentication) {
    var vm = this;

    vm.invoice = invoice;
    vm.authentication = Authentication;

  }
}());
