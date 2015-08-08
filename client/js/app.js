/*global define */

define([
    'backbone',
    'marionette',
	'underscore',
    'regions/notification',
    'regions/dialog',
    'regions/nav',
    'models/User',
	'views/PiggyBankView'
], function (Backbone, Marionette, _, NotifyRegion, DialogRegion, NavRegion,
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
        app.events = _.clone(Backbone.Events);

        $(".edit").on("click", function() {
            app.events.trigger("editButtonClicked");
            $(".done").removeClass("display-none");
            $(".edit").addClass("display-none");
        });

        $(".done").on("click", function() {
            app.events.trigger("doneButtonClicked");
            $(".edit").removeClass("display-none");
            $(".done").addClass("display-none");
        });
	});

    app.on("initialize:after", function(options){
        if (Backbone.history){
            Backbone.history.start();
        }
    });

	return window.app = app;
});
