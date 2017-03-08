(function () {
    'use strict';

    /** @ngInject */
    function ModalInvoiceController($modalInstance, $rootScope) {
        var vm = this;


        vm.cancel = function () {
            $modalInstance.dismiss();
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
