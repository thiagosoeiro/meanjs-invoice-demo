(function () {
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
          mainstate = $state.get('invoices');
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
          liststate = $state.get('invoices.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/invoices/client/views/list-invoices.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InvoicesController,
          mockInvoice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('invoices.view');
          $templateCache.put('/modules/invoices/client/views/view-invoice.client.view.html', '');

          // create mock invoice
          mockInvoice = new InvoicesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Invoice about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          InvoicesController = $controller('InvoicesController as vm', {
            $scope: $scope,
            invoiceResolve: mockInvoice
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:invoiceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.invoiceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            invoiceId: 1
          })).toEqual('/invoices/1');
        }));

        it('should attach an invoice to the controller scope', function () {
          expect($scope.vm.invoice._id).toBe(mockInvoice._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/invoices/client/views/view-invoice.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/invoices/client/views/list-invoices.client.view.html', '');

          $state.go('invoices.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('invoices/');
          $rootScope.$digest();

          expect($location.path()).toBe('/invoices');
          expect($state.current.templateUrl).toBe('/modules/invoices/client/views/list-invoices.client.view.html');
        }));
      });
    });
  });
}());
