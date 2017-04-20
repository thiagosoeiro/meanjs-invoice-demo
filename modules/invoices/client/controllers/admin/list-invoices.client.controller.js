(function () {
  'use strict';

  angular
    .module('invoices.admin')
    .controller('InvoicesAdminListController', InvoicesAdminListController);

  InvoicesAdminListController.$inject = ['InvoicesService', '$window', 'Notification'];

  function InvoicesAdminListController(InvoicesService, $window, Notification) {
    var vm = this;
    vm.remove = remove;

    vm.invoices = InvoicesService.query();

    function remove(invoice) {
      if ($window.confirm('Are you sure you want to delete this draft?')) {
        invoice.$remove(function (result) {
           vm.invoices.splice(vm.invoices.indexOf(invoice), 1);
           Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Draft deleted successfully!' });
        });
      }
    }
  }
}());
