(function () {
  'use strict';

  angular
    .module('invoices.admin')
    .controller('InvoicesAdminListController', InvoicesAdminListController);

  InvoicesAdminListController.$inject = ['InvoicesService', '$window', 'Notification'];

  function InvoicesAdminListController(InvoicesService, $window, Notification) {
    var vm = this;

    vm.invoices = InvoicesService.query();

  }
}());
