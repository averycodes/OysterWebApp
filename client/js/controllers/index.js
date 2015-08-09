/*global define */

define([
	'app',
    'views/ChecklistView',
    'views/WishlistView',
    'views/HistoryView',
    'views/SettingsView',
    'collections/TaskCollection',
    'collections/WishCollection'
], function (app, ChecklistView, WishlistView, HistoryView, SettingsView,
             TaskCollection, WishCollection) {
	'use strict';

	return {
        showChecklist: function() {
            app.main.show(new ChecklistView());
            app.nav.activateChecklist();
        },
        showWishlist: function() {
            app.main.show(new WishlistView());
            app.nav.activateWishlist();
        },
        showHistory: function() {
            app.main.show(new HistoryView());
            app.nav.activateHistory();
        },
        showSettings: function() {
            app.main.show(new SettingsView());
            app.nav.activateSettings();
        },
        logout: function() {
            Backbone.history.navigate('/accounts/logout', {
                trigger: true
            });
        }
	};
});
