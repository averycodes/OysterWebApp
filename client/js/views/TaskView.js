/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'app'
], function (Marionette, templates, _, app) {
    'use strict';

    return Marionette.ItemView.extend({
        className: 'task-view item',
        template: templates.task,

        ui: {
            'remove': '.remove'
        },

        events: {
            'click': 'onClickTask',
            'click .remove': 'onClickRemove'
        },

        onRender: function() {
            if (!this.model.get('doable')) {
                $(this.el).addClass('disabled');
            }

            // event listener
        },

        onShow: function() {
            this.listenTo(app.events, 'editButtonClicked', this.onClickEdit);
            this.listenTo(app.events, 'doneButtonClicked', this.onClickDone);
        },

        onClickTask: function(e) {
            e.preventDefault();
            this.model.set('completed', true);
            this.model.save();

            var user = window.app.user,
                bank_amt = user.get("bank");

            user.set("bank", bank_amt + this.model.get("amount"));

            this.close();
        },

        onClickRemove: function(e) {
            e.preventDefault();
            this.model.destroy();
            this.close();
        },

        onClickEdit: function() {
            this.ui.remove.removeClass('display-none');
        },

        onClickDone: function() {
            this.ui.remove.addClass('display-none');
        }
    });
});
