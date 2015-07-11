/*global define */

define([
    'marionette',
    'templates',
], function (Marionette, templates) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.piggybank,

        modelEvents: {
            "change": "onModelChanged"
        },

        initialize: function() {
            this.model = window.app.user;
        },

        onModelChanged: function() {
            this.render();
        }
    });
});
