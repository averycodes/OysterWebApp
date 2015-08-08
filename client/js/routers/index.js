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
            'settings': 'showSettings',
            'logout': 'logout',
            '': 'showChecklist',
		}
	});
});
