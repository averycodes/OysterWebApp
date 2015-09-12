/*global define */

define([
	'marionette',
	'templates',
	'underscore',
	'moment'
], function (Marionette, templates, _, moment) {
	'use strict';

	return Marionette.ItemView.extend({
		className: 'task-rule-view card ui',
		template: templates.taskrule,

		templateHelpers: function() {
			var datestr = "M-D-YYYY, h A";
			return {
				'next_run': moment(this.model.get('next_scheduled_run')).fromNow()
			};
		},

		ui: {

		},

		events: {

		},

		initialize: function() {

		},

		onRender: function() {

		},

		onShow: function() {

		},

	});
});
