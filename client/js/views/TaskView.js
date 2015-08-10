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
            'remove': '.remove',
            'edit': '.edit'
        },

        events: {
            'click': 'onClickTask',
            'click .remove': 'onClickRemove',
            'mouseover': 'onHover',
            'mouseout': 'onStopHover'

        },

        onRender: function() {
            if (!this.model.get('doable')) {
                $(this.el).addClass('disabled');
            }
            this.ui.remove.hide();
            this.ui.edit.hide();
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

        onHover: function() {
            this.ui.remove.show();
            this.ui.edit.show();
        },

        onStopHover: function() {
            this.ui.remove.hide();
            this.ui.edit.hide();
        }
    });
});
