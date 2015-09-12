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
			'click .edit-button': '',
			'click .cancel-button': 'onClickCancelButton',
			'click .reinstate-button': 'onClickReinstateButton',
		},

		initialize: function() {

		},

		onRender: function() {

		},

		onShow: function() {

		},

		onClickCancelButton: function(e) {
			e.preventDefault();

			this.model.set('cancelled', true);
			this.model.save();
			this.render();
		},

		onClickReinstateButton: function(e) {
			e.preventDefault();

			this.model.set('cancelled', false);
			this.model.save();
			this.render();
		}

	});
});
