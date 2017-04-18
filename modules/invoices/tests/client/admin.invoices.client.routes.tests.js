﻿(function () {
  'use strict';

  describe('Invoices Route Tests', function () {
    // Initialize global variables
    var $scope,
      InvoicesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InvoicesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InvoicesService = _InvoicesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.invoices');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/invoices');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.invoices.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/invoices/client/views/admin/list-invoices.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InvoicesAdminController,
          mockInvoice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.invoices.create');
          $templateCache.put('/modules/invoices/client/views/admin/form-invoice.client.view.html', '');

          // Create mock invoice
          mockInvoice = new InvoicesService();

          // Initialize Controller
          InvoicesAdminController = $controller('InvoicesAdminController as vm', {
            $scope: $scope,
            invoiceResolve: mockInvoice
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.invoiceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/invoices/create');
        }));

        it('should attach an invoice to the controller scope', function () {
          expect($scope.vm.invoice._id).toBe(mockInvoice._id);
          expect($scope.vm.invoice._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/invoices/client/views/admin/form-invoice.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InvoicesAdminController,
          mockInvoice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.invoices.edit');
          $templateCache.put('/modules/invoices/client/views/admin/form-invoice.client.view.html', '');

          // Create mock invoice
          mockInvoice = new InvoicesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Invoice about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          InvoicesAdminController = $controller('InvoicesAdminController as vm', {
            $scope: $scope,
            invoiceResolve: mockInvoice
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:invoiceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.invoiceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            invoiceId: 1
          })).toEqual('/admin/invoices/1/edit');
        }));

        it('should attach an invoice to the controller scope', function () {
          expect($scope.vm.invoice._id).toBe(mockInvoice._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/invoices/client/views/admin/form-invoice.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
