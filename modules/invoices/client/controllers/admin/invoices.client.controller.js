(function () {
  'use strict';

  angular
    .module('invoices.admin')
    .controller('InvoicesAdminController', InvoicesAdminController);

  InvoicesAdminController.$inject = ['$scope', '$state', '$window', 'invoiceResolve', 'Authentication', 'Notification'];

  function InvoicesAdminController($scope, $state, $window, invoice, Authentication, Notification) {
    var vm = this;

    vm.invoice = invoice;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Invoice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.invoice.$remove(function() {
          $state.go('admin.invoices.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Invoice deleted successfully!' });
        });
      }
    }

    // Save Invoice
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.invoiceForm');
        return false;
      }

      // Create a new invoice, or update the current instance
      vm.invoice.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.invoices.list'); // should we send the User to the list or the updated Invoice's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Invoice saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Invoice save error!' });
      }
    }
  }
}());
