/*global define */

define([
  'backbone',
  'marionette',
  'underscore',
  'models/User',
  'views/PiggyBankView',
  'routers/router',
], function (Backbone, Marionette, _, User, PiggyBankView, Router) {
  'use strict';

  var app = new Marionette.Application();

  app.addRegions({
    main: '#main',
    bank: '#bank',
  });

  app.addInitializer(function () {
    app.user = new User();
    app.user.fetch();
    app.bank.show(new PiggyBankView({model: app.user}));

    app.events = _.clone(Backbone.Events);

    window.app = app;
    this.router = new Router();
  });

  app.on("start", function(options){
    if (Backbone.history){
    Backbone.history.start();
    }
  });


  return app;
});
