/*global define */

define([
    'backbone',
	'marionette',
    'regions/notification',
    'regions/dialog',
    'regions/nav',
    'models/User',
	'views/PiggyBankView'
], function (Backbone, Marionette, NotifyRegion, DialogRegion, NavRegion,
             User, PiggyBankView) {
	'use strict';

	var app = new Marionette.Application();

	app.addRegions({
		main: '#main',
        bank: '#bank',
        nav: {
            selector: '#nav',
            regionType: NavRegion
        }
	});

	app.addInitializer(function () {
        app.user = new User();
        app.user.fetch();
        app.bank.show(new PiggyBankView());
	});

    app.on("initialize:after", function(options){
        if (Backbone.history){
            Backbone.history.start();
        }
    });

	return window.app = app;
});
