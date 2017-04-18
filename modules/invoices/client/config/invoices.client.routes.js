(function () {
  'use strict';

  angular
    .module('invoices.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('invoices', {
        abstract: true,
        url: '/invoices',
        template: '<ui-view/>'
      })
      .state('invoices.list', {
        url: '',
        templateUrl: '/modules/invoices/client/views/list-invoices.client.view.html',
        controller: 'InvoicesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Invoices List'
        }
      })
      .state('invoices.view', {
        url: '/:invoiceId',
        templateUrl: '/modules/invoices/client/views/view-invoice.client.view.html',
        controller: 'InvoicesController',
        controllerAs: 'vm',
        resolve: {
          invoiceResolve: getInvoice
        },
        data: {
          pageTitle: 'Invoice {{ invoiceResolve.title }}'
        }
      });
  }

  getInvoice.$inject = ['$stateParams', 'InvoicesService'];

  function getInvoice($stateParams, InvoicesService) {
    return InvoicesService.get({
      invoiceId: $stateParams.invoiceId
    }).$promise;
  }
}());
