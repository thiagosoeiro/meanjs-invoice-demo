(function () {
  'use strict';

  angular.module('invoices.admin')
    .controller('ModalInvoiceController', ModalInvoiceController);

  ModalInvoiceController.$inject = ['$uibModalInstance', '$scope', '$rootScope', '$state', 'INVOICE_CONSTANTS'];

  function ModalInvoiceController($uibModalInstance, $scope, $rootScope, $state, INVOICE_CONSTANTS) {
    var vm = this;

    //todo: generate pdf

    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };

    // Save Invoice
    vm.save = function (isValid) {
      vm.isLoading = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form');
        vm.isLoading = false;
        return false;
      }

      vm.invoice.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.isLoading = false;
        $uibModalInstance.dismiss();
        $rootScope.$broadcast('refreshInvoicePage');
      }

      function errorCallback(res) {
        vm.isLoading = false;
        vm.error = res.data.message;
      }
    };

    vm.init = function () {
      vm.isLoading = false;
      vm.invoice = $rootScope.invoice;

      //Mail data
      vm.invoice.subject = ['Invoice from', vm.invoice.senderName, '|', '#', vm.invoice.number].join(' ');

      vm.invoice.message = INVOICE_CONSTANTS.currentMessage;
      //todo: use lodash instead
      //sets the mail body with tags replacement
      INVOICE_CONSTANTS.messageTags.forEach(function (item) {
        vm.invoice.message = vm.invoice.message.replace(item.tag,
          vm.invoice[item.replaceWith] === undefined ? '' : vm.invoice[item.replaceWith]);
      });
    };

    vm.init();
  }



}());
