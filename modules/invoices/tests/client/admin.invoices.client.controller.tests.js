﻿(function () {
  'use strict';

  describe('Invoices Admin Controller Tests', function () {
    // Initialize global variables
    var InvoicesAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      InvoicesService,
      mockInvoice,
      Notification;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _InvoicesService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      InvoicesService = _InvoicesService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock invoice
      mockInvoice = new InvoicesService({
        _id: '525a8422f6d0f87f0e407a33',
        "title": "New Invoice",
        "content": "Content",
        "items": [
          {
            "description": "Product 1",
            "quantity": "10",
            "rate": 2,
            "amount": 20
          },
          {
            "description": "Product 2",
            "quantity": "3",
            "rate": 6,
            "amount": 18
          }
        ],
        "number": "1632",
        "senderName": "Eric",
        "receiverName": "Paul",
        "paymentTerms": "Payments terms",
        "senderEmail": "eric@eric.com",
        "receiverEmail": "paul@paul.com",
        "invoiceDate": "2017/03/01",
        "invoiceDueDate": "2017/03/10",
        "total": 38,
        "balanceDue": 18,
        "amountPaid": 20,
        "notes": "Notes",
        "terms": "Terms",
        "subject": "Invoice from Eric | # 1632",
        "message": "Hi Paul,\nThe following invoice has been created on your account:\nInvoice Number: 1632\nFrom: Eric\nBalance Due: 18\nTotal: 38\nAmount Paid: 20\nNotes: Notes\nTerms: Terms",
        "isEditable": "false"
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Invoices controller.
      InvoicesAdminController = $controller('InvoicesAdminController as vm', {
        $scope: $scope,
        invoiceResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleInvoicePostData;

      beforeEach(function () {
        // Create a sample invoice object
        sampleInvoicePostData = new InvoicesService({
          title: 'An Invoice about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.invoice = sampleInvoicePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (InvoicesService) {
        // Set POST response
        $httpBackend.expectPOST('/api/invoices', sampleInvoicePostData).respond(mockInvoice);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Invoice saved successfully!' });
        // Test URL redirection after the invoice was created
        expect($state.go).toHaveBeenCalledWith('admin.invoices.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/invoices', sampleInvoicePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Invoice save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock invoice in $scope
        $scope.vm.invoice = mockInvoice;
      });

      it('should update a valid invoice', inject(function (InvoicesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/invoices\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Invoice saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.invoices.list');
      }));

      it('should  call Notification.error if error', inject(function (InvoicesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/invoices\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Invoice save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup invoices
        $scope.vm.invoice = mockInvoice;
      });

      it('should delete the invoice and redirect to invoices', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/invoices\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Invoice deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.invoices.list');
      });

      it('should should not delete the invoice and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
