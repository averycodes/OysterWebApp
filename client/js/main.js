require.config({
	paths: {
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		marionette: '../bower_components/marionette/lib/backbone.marionette.min',
		jquery: '../bower_components/jquery/dist/jquery',
        localStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		moment: '../bower_components/moment/min/moment.min',
		tpl: 'lib/tpl',
        bootstrap: 'lib/bootstrap.min',
        semantic: '../semantic/dist/semantic.min'
	},

	shim: {
		underscore: {
			exports: '_'
		},

		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
		},

		marionette: {
            exports: 'Backbone.Marionette',
			deps: ['backbone']
		},

        bootstrap: {
            deps: ['jquery']
        },

        semantic: {
            deps: ["jquery"],
            // Export multiple functions: http://stackoverflow.com/a/18650150/14731
            exports: "$",
            init: function($)
            {
                return {
                    // "$.fn.accordion": $.fn.accordion,
                    // "$.fn.accordion.settings": $.fn.accordion.settings,
                    // "$.fn.api": $.fn.api,
                    // "$.fn.apiButton": $.fn.apiButton,
                    // "$.fn.apiButton.settings": $.fn.apiButton.settings,
                    // "$.fn.colorize": $.fn.colorize,
                    // "$.fn.colorize.settings": $.fn.colorize.settings,
                    // "$.fn.form": $.fn.form,
                    // "$.fn.form.settings": $.fn.form.settings,
                    // "$.fn.state": $.fn.state,
                    // "$.fn.state.settings": $.fn.state.settings,
                    // "$.fn.chatroom": $.fn.chatroom,
                    // "$.fn.chatroom.settings": $.fn.chatroom.settings,
                    // "$.fn.checkbox": $.fn.checkbox,
                    // "$.fn.checkbox.settings": $.fn.checkbox.settings,
                    // "$.fn.dimmer": $.fn.dimmer,
                    // "$.fn.dimmer.settings": $.fn.dimmer.settings,
                    "$.fn.dropdown": $.fn.dropdown,
                    "$.fn.dropdown.settings": $.fn.dropdown.settings,
                    // "$.fn.modal": $.fn.modal,
                    // "$.fn.modal.settings": $.fn.modal.settings,
                    // "$.fn.nag": $.fn.nag,
                    // "$.fn.nag.settings": $.fn.nag.settings,
                    // "$.fn.popup": $.fn.popup,
                    // "$.fn.popup.settings": $.fn.popup.settings,
                    // "$.fn.rating": $.fn.rating,
                    // "$.fn.rating.settings": $.fn.rating.settings,
                    // "$.fn.search": $.fn.search,
                    // "$.fn.search.settings": $.fn.search.settings,
                    // "$.fn.shape": $.fn.shape,
                    // "$.fn.shape.settings": $.fn.shape.settings,
                    // "$.fn.sidebar": $.fn.sidebar,
                    // "$.fn.sidebar.settings": $.fn.sidebar.settings,
                    "$.fn.tab": $.fn.tab,
                    "$.fn.tab.settings": $.fn.tab.settings,
                    // "$.fn.transition": $.fn.transition,
                    // "$.fn.transition.settings": $.fn.transition.settings,
                    // "$.fn.video": $.fn.video,
                    // "$.fn.video.settings": $.fn.video.settings
                };
            }
        }

	},
    waitSeconds: 60
});

require([
	'app',
    'jquery',
    'semantic',
], function (app, PagesModule) {
	'use strict';

	app.start();
});
