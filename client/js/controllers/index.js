/*global define */

define([
	'app',
    'views/ChecklistView',
    'views/WishlistView',
    'views/HistoryView',
    'views/RecurringTasksView',
    'views/SettingsView'
], function (app, ChecklistView, WishlistView, HistoryView, RecurringTasksView,
             SettingsView) {
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
        showRecurringTasks: function() {
            app.main.show(new RecurringTasksView());
            app.nav.activateRecurring();
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
