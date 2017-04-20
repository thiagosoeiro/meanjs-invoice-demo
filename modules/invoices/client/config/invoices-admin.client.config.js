(function () {
  'use strict';

  // Configuring the Invoices Admin module
  angular
    .module('invoices.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    
    // Menus.addSubMenuItem('topbar', 'admin', {
    //   title: 'List Sent Invoices',
    //   state: 'admin.invoices.list'
    // });

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create New Invoice',
      state: 'admin.invoices.create'
    });


    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Drafts',
      state: 'admin.drafts.list'
    });
  }
}());
