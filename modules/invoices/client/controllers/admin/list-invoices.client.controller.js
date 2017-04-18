(function () {
  'use strict';

  angular
    .module('invoices.admin')
    .controller('InvoicesAdminListController', InvoicesAdminListController);

  InvoicesAdminListController.$inject = ['InvoicesService'];

  function InvoicesAdminListController(InvoicesService) {
    var vm = this;

    vm.invoices = InvoicesService.query();
  }
}());
