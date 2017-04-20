(function () {
  'use strict';

  angular
    .module('invoices')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Invoices',
      state: 'invoices',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'invoices', {
      title: 'List Sent Invoices',
      state: 'invoices.list',
      roles: ['*']
    });
  }
}());
