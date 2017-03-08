(function () {
  'use strict';

  /** @ngInject */
  function ModalInvoiceController($modalInstance, $rootScope, $state) {
    var vm = this;


    vm.cancel = function () {
      $modalInstance.dismiss();
    };

    // Save Invoice
    vm.save = function () {
      if (vm.invoice._id) {
        vm.invoice.$update(successCallback, errorCallback);
      } else {
        vm.invoice.$save(successCallback, errorCallback);
      }
      
      function successCallback(res) {
        // $state.go('invoices.create');
        $state.go($state.current, {}, {reload: true}); 
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.init = function () {
      vm.isLoading = false;
      vm.invoice = $rootScope.invoice;
    };

    vm.init();
  }

  angular.module('invoices')
    .controller('ModalInvoiceController', ModalInvoiceController);

})();
