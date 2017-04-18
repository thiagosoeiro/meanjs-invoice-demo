'use strict';

(function () {
  // Authentication controller Spec
  describe('AuthenticationController', function () {
    // Initialize global variables
    var AuthenticationController,
      scope,
      $httpBackend,
      $stateParams,
      $state,
      $location,
      Notification;

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

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    describe('Logged out user', function () {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Notification_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        Notification = _Notification_;

        // Spy on Notification
        spyOn(Notification, 'error');
        spyOn(Notification, 'success');

        // Ignore parent template get on state transitions
        $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200);
        $httpBackend.whenGET('/modules/core/client/views/400.client.view.html').respond(200);

        // Initialize the Authentication controller
        AuthenticationController = $controller('AuthenticationController as vm', {
          $scope: scope
        });
      }));

      describe('$scope.signin()', function () {        

        it('should fail to log in with nothing', function () {
          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Missing credentials'
          });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test Notification.error is called
          expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing credentials', title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
        });

        it('should fail to log in with wrong credentials', function () {
          // Foo/Bar combo assumed to not exist
          scope.vm.authentication.user = { username: 'Foo' };
          scope.vm.credentials = 'Bar';

          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Unknown user'
          });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test Notification.error is called
          expect(Notification.error).toHaveBeenCalledWith({ message: 'Unknown user', title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
        });
      });

      describe('$scope.signup()', function () {
        it('should fail to register with duplicate Username', function () {
          // Test expected POST request
          $httpBackend.when('POST', '/api/auth/signup').respond(400, {
            'message': 'Username already exists'
          });

          scope.vm.signup(true);
          $httpBackend.flush();

          // Test Notification.error is called
          expect(Notification.error).toHaveBeenCalledWith({ message: 'Username already exists', title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
        });
      });
    });

    describe('Logged in user', function () {
      beforeEach(inject(function ($controller, $rootScope, _$location_, _Authentication_) {
        scope = $rootScope.$new();

        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        AuthenticationController = $controller('AuthenticationController as vm', {
          $scope: scope
        });
      }));

      it('should be redirected to home', function () {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });
  });
}());
