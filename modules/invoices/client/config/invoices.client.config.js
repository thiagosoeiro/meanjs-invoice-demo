(function () {
  'use strict';

  angular
    .module('invoices')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Invoices',
      state: 'invoices',
      type: 'dropdown',
      roles: ['admin','user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'invoices', {
      title: 'List Invoices',
      state: 'invoices.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'invoices', {
      title: 'Create Invoice',
      state: 'invoices.create',
      roles: ['admin', 'user']
    });
  }
}());
