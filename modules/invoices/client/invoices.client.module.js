(function (app) {
  'use strict';

  app.registerModule('invoices', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('invoices.admin', ['core.admin']);
  app.registerModule('invoices.admin.routes', ['core.admin.routes']);
  app.registerModule('invoices.services');
  app.registerModule('invoices.routes', ['ui.router', 'core.routes', 'invoices.services']);
}(ApplicationConfiguration));
