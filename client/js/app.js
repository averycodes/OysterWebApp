/*global define */

define([
  'backbone',
  'marionette',
  'underscore',
  'models/User',
  'views/PiggyBankView',
  'views/NavView',
  'routers/router',
], function (Backbone, Marionette, _, User, PiggyBankView, NavView, Router) {
  'use strict';

  var app = new Marionette.Application();

  app.addRegions({
    main: '#main',
    nav: '#nav',
    bank: '#bank',
  });

  app.addInitializer(function () {
    app.user = new User();
    app.user.fetch();
    app.bank.show(new PiggyBankView({model: app.user}));
    app.nav.show(new NavView());

    app.events = _.clone(Backbone.Events);

    window.app = app;
    app.router = new Router();
  });

  app.on("start", function(options){
    if (Backbone.history){
    Backbone.history.start();
    }
  });


  return app;
});
