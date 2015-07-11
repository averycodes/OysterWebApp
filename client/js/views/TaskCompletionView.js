/*global define */

define([
    'marionette',
    'templates'
], function (Marionette, templates) {
    'use strict';

    return Marionette.Layout.extend({
        template: templates.taskcompletion,

        regions: {
            completionOptions: '.completion-options',
            completionGateway: '.completion-gateway'
        },

        onRender: function() {
            // this.completionOptions.show(new OysterOptionsView());
        }

    });
});