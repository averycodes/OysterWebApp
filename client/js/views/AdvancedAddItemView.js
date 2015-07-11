/*global define */

define([
    'marionette',
    'templates',
    'views/TaskCompletionView'
], function (Marionette, templates, TaskCompletionView) {
    'use strict';

    return Marionette.Layout.extend({
        template: templates.advancedadditem,

        events: {
            'click .cancel': 'onClickCancel'
        },

        regions: {
            taskCompletion: '#task-completion'
        },

        initialize: function(options) {
            this.parent = this.options.parent;
        },

        onDomRefresh: function() {
            this.taskCompletion.show(new TaskCompletionView());
        },

        onClickCancel: function(e) {
            e.preventDefault();
            this.parent.showBasicAdd();
        }

    });
});
