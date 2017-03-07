(function () {
  'use strict';

  // Invoices controller
  angular
    .module('invoices')
    .controller('InvoicesController', InvoicesController);

  InvoicesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'invoiceResolve'];

  function InvoicesController($scope, $state, $window, Authentication, invoice) {
    var vm = this;

    vm.authentication = Authentication;
    vm.invoice = invoice;
    vm.invoice.items = [];
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.newItem = {};

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

    vm.calculateItemAmount = function () {
      if (vm.newItem.quantity && vm.newItem.rate) {
        vm.newItem.amount = vm.newItem.quantity * vm.newItem.rate;
      }
    }

    vm.addNewItem = function (item) {
      if (isItemValid(item)) {
        vm.invoice.items.push({ description: item.description, quantity: item.quantity, rate: item.rate, amount: item.amount });
        vm.newItem = undefined;
      }
    }

    vm.updateItem = function (item, form, index) {
      if (isItemValid(item)) {
        item.$edit = false;
      }
    }

    vm.deleteItem = function (item, index) {
      vm.invoice.items.splice(index, 1);
    };

    function isItemValid(item) {
      if (item.description && item.quantity && item.rate && item.amount) {
        return true;
      }
      return false;
    }

    // Remove existing Invoice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.invoice.$remove($state.go('invoices.list'));
      }
    }

    // Save Invoice
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.invoiceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.invoice._id) {
        vm.invoice.$update(successCallback, errorCallback);
      } else {
        vm.invoice.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('invoices.view', {
          invoiceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
