(function () {
  'use strict';

  // Invoices controller
  angular
    .module('invoices')
    .controller('InvoicesController', InvoicesController);

  InvoicesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'invoiceResolve', '$modal', 'ModalInvoice'];

  function InvoicesController($scope, $state, $window, Authentication, invoice, $modal, ModalInvoice) {
    var vm = this;

    vm.authentication = Authentication;
    vm.invoice = invoice;
    vm.invoice.title = "Invoice";
    vm.invoice.items = [];
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.newItem = {};

    /*Date component properties and validation*/
    vm.disabled = function (date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };
    vm.maxDate = new Date(2020, 5, 22);
    vm.open = function ($event, element) {
      if (element == 0) {
        vm.status.opened = true;
      } else {
        vm.status.opened2 = true;
      }
    };
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[1];
    vm.status = {
      opened: false,
      opened2: false
    };
    /*End of date component properties and validation*/

    vm.calculateItemAmount = function () {
      if (vm.newItem.quantity && vm.newItem.rate) {
        vm.newItem.amount = vm.newItem.quantity * vm.newItem.rate;
      }
    };

    vm.addNewItem = function (item) {
      if (isItemValid(item)) {
        vm.invoice.items.push({ description: item.description, quantity: item.quantity, rate: item.rate, amount: item.amount });
        vm.newItem = undefined;
      }
    };

    vm.updateItem = function (item, form, index) {
      if (isItemValid(item)) {
        item.$edit = false;
      }
    };

    vm.deleteItem = function (item, index) {
      vm.invoice.items.splice(index, 1);
    };

    function isItemValid(item) {
      if (item.description && item.quantity && item.rate && item.amount) {
        return true;
      }
      return false;
    };

    vm.openModal = function (invoice, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.invoiceForm');
        //return false; //todo - uncomment
      }
      var modalInstance = ModalInvoice.open(invoice);
      modalInstance.result.then(function () {
      }).catch(function () {
      });
    };

    // Remove existing Invoice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.invoice.$remove($state.go('invoices.list'));
      }
    }  
  }
}());
