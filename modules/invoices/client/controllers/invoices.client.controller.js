(function () {
  'use strict';

  // Invoices controller
  angular
    .module('invoices')
    .controller('InvoicesController', InvoicesController);

  InvoicesController.$inject = ['$modal', '$scope', '$state', '$timeout', '$window', 'Authentication', 'invoiceResolve', 'ModalInvoice', 'toaster'];

  function InvoicesController($modal, $scope, $state, $timeout, $window, Authentication, invoice, ModalInvoice, toaster) {
    var vm = this;

    vm.authentication = Authentication;
    vm.invoice = invoice;
    vm.invoice.title = vm.invoice.title === undefined ? 'Invoice' : vm.invoice.title;
    vm.invoice.items = vm.invoice.items === undefined ? [] : vm.invoice.items;
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
      if (element === 0) {
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

    vm.calculateItemAmount = function (item) {
      if (item.quantity && item.rate) {
        item.amount = item.quantity * item.rate;
      }

    };

    vm.processValues = function () {
      if (vm.invoice.items.length) {
        var array = vm.invoice.items.map(function (a) { return a.amount; });
        var sum = array.reduce((a, b) => a + b, 0);
        vm.invoice.total = sum;
        vm.invoice.balanceDue = vm.invoice.total -
          (vm.invoice.amountPaid === undefined ? 0
            : vm.invoice.amountPaid);
        return;
      }
      vm.invoice.total = 0;
      vm.invoice.balanceDue = 0 -
        (vm.invoice.amountPaid === undefined ? 0
          : vm.invoice.amountPaid);
    }

    vm.addNewItem = function (item) {
      if (isItemValid(item)) {
        vm.invoice.items.push({
          description: item.description, quantity: item.quantity,
          rate: item.rate, amount: item.amount
        });
        vm.processValues();
        vm.newItem = undefined;
      }
    };

    vm.updateItem = function (item, form, index) {
      if (isItemValid(item)) {
        vm.processValues();
        item.$edit = false;
      }
    };

    vm.deleteItem = function (item, index) {
      vm.invoice.items.splice(index, 1);
      vm.processValues();
    };

    function isItemValid(item) {
      return item.description && item.quantity && item.rate && item.amount;
    };

    vm.openModal = function (invoice, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.invoiceForm');
        return false; //todo - uncomment
      }
      var modalInstance = ModalInvoice.open(invoice);
      modalInstance.result.then(function () {
      }).catch(function () {
      });
    };

    $scope.$on("refreshInvoicePage", function () {
      $state.go($state.current, {}, { reload: true });
      $timeout(showAlert, 500);
    });

    function showAlert() {
      toaster.pop('success', "Thank you for invoicing with us!", "Your invoice has been sent!");
    }

    // Remove existing Invoice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.invoice.$remove($state.go('invoices.list'));
      }
    }
  }
}());
