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
        bank: '#piggy-bank',
        nav: {
            selector: '#nav',
            regionType: NavRegion
        },
        notification: {
            selector: "#notification",
            regionType: NotifyRegion
        },
        dialog: {
            selector: "#dialog",
            regionType: DialogRegion
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

	app.vent.on('menu:activate', function (activePageModel) {
        menu.collection.findWhere({active: true})
            .set('active', false);
        activePageModel.set('active', true);
        menu.render();
	});

    app.commands.setHandler("app:notify", function(jsonData) {
        require(['views/NotificationView'], function(NotifyView) {
            app.notification.show(new NotifyView({
                model: new Backbone.Model(jsonData)
            }));
        });
    });

	return window.app = app;
});
