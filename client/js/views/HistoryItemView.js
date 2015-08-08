/*global define */

define([
    'marionette',
    'templates',
    'underscore',
], function (Marionette, templates, _) {
    'use strict';

    return Marionette.ItemView.extend({
        className: 'history-item-view list-group-item',
        template: templates.history,
        tagName: 'li',
        className: 'table-view-cell media',

        ui: {
            'undo': '.undo',
            'remove': '.remove',
            'vector': '.vector'
        },

        events: {
            'click .undo': 'onClickUndo',
            'click .remove': 'onClickRemove'
        },

        onShow: function() {
            this.listenTo(app.events, 'editButtonClicked', this.onClickEdit);
            this.listenTo(app.events, 'doneButtonClicked', this.onClickDone);
        },

        onClickUndo: function(e) {
            e.preventDefault();
            this.model.set('completed', false);
            this.model.save();

            var user = window.app.user,
                bank_amt = user.get("bank");

            user.set("bank", bank_amt - this.model.get("amount"));

            this.close();
        },

        onClickRemove: function(e) {
            e.preventDefault();
            this.model.destroy();
            this.close();
        },

        onClickEdit: function() {
            this.ui.remove.removeClass('display-none');
            this.ui.undo.removeClass('display-none');
            this.ui.vector.addClass('display-none');
        },

        onClickDone: function() {
            this.ui.remove.addClass('display-none');
            this.ui.undo.addClass('display-none');
            this.ui.vector.removeClass('display-none');
        }
    });
});
