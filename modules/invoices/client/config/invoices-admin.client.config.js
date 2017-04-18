(function () {
  'use strict';

  // Configuring the Invoices Admin module
  angular
    .module('invoices.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Invoices',
      state: 'admin.invoices.list'
    });
  }
}());
