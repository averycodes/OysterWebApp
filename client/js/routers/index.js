/*global define */

define([
	'marionette'
], function (Marionette) {
	'use strict';

	return Marionette.AppRouter.extend({
		appRoutes: {
            'checklist': 'showChecklist',
            'wishlist': 'showWishlist',
            'history': 'showHistory',
            'recurring': 'showRecurringTasks',
            'settings': 'showSettings',
            'logout': 'logout',
            '': 'showChecklist',
		}
	});
});
