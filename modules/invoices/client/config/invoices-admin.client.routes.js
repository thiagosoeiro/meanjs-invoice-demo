(function () {
  'use strict';

  angular
    .module('invoices.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.invoices', {
        abstract: true,
        url: '/invoices',
        template: '<ui-view/>'
      })
      .state('admin.invoices.list', {
        url: '',
        templateUrl: '/modules/invoices/client/views/admin/list-invoices.client.view.html',
        controller: 'InvoicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.invoices.create', {
        url: '/create',
        templateUrl: '/modules/invoices/client/views/admin/form-invoice.client.view.html',
        controller: 'InvoicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          invoiceResolve: newInvoice
        }
      })
      .state('admin.invoices.edit', {
        url: '/:invoiceId/edit',
        templateUrl: '/modules/invoices/client/views/admin/form-invoice.client.view.html',
        controller: 'InvoicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          invoiceResolve: getInvoice
        }
      });
  }

  getInvoice.$inject = ['$stateParams', 'InvoicesService'];

  function getInvoice($stateParams, InvoicesService) {
    return InvoicesService.get({
      invoiceId: $stateParams.invoiceId
    }).$promise;
  }

  newInvoice.$inject = ['InvoicesService'];

  function newInvoice(InvoicesService) {
    return new InvoicesService();
  }
}());
