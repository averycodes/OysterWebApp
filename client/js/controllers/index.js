/*global define */

define([
	'app',
    'views/ChecklistView',
    'views/WishlistView',
    'views/HistoryView',
    'collections/TaskCollection',
    'collections/WishCollection'
], function (app, ChecklistView, WishlistView, HistoryView,
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
            // app.main.show(new HistoryView());
            app.nav.activateSettings();
        }
	};
});
