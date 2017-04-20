(function () {
  'use strict';

  angular
    .module('invoices.admin')
    .controller('InvoicesAdminController', InvoicesAdminController);

  InvoicesAdminController.$inject = ['$uibModal', '$scope', '$state', '$timeout', '$window', '$rootScope', 'invoiceResolve', 'ModalInvoice', 'Authentication', 'Notification'];

  function InvoicesAdminController($uibModal, $scope, $state, $timeout, $window, $rootScope, invoice, ModalInvoice, Authentication, Notification) {
    var vm = this;

    vm.invoice = invoice;
    vm.invoice.title = vm.invoice.title === undefined ? 'Invoice' : vm.invoice.title;
    vm.invoice.items = vm.invoice.items === undefined ? [] : vm.invoice.items;

    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save; //not in use here

    vm.newItem = {};

    // Remove existing Invoice - not in use
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.invoice.$remove(function () {
          $state.go('admin.invoices.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Invoice deleted successfully!' });
        });
      }
    }

    // Save Invoice
    function save() {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.invoiceForm');
      //   return false;
      // }
      // Create a new draft, or update the current instance
      vm.invoice.isEditable = true;
      vm.invoice.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.drafts.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Draft saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Invoice save error!' });
      }
    }

    ////////////////////////////////////////////////////////
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

    function add(a, b) {
      return a + b;
    }

    vm.processValues = function () {
      if (vm.invoice.items.length) {
        var array = vm.invoice.items.map(function (a) { return a.amount; });
        var sum = array.reduce(add, 0);//Freduce((a, b) => a + b, 0);
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

      //TODO: refactor - not working on new MEAN.js version
      // var modalInstance = ModalInvoice.open(invoice);
      // modalInstance.result.then(function () {
      // }).catch(function () {
      // });

      $rootScope.invoice = invoice;
      var modalInstance = $uibModal.open({
        //'modules/invoices/client/views/admin/modal-invoice.html',
        templateUrl: 'myModalContent.html',
        controllerAs: 'modal',
        controller: 'ModalInvoiceController',
        size: 'md'
      });

    };

    $scope.$on("refreshInvoicePage", function () {
      // $state.go($state.current, {}, { reload: true });
      $state.go('invoices.list');
      $timeout(showAlert, 500);
    });

    function showAlert() {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Thank you for invoicing with us! Your invoice has been sent!' });
    }










  }
}());
