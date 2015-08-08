/*global define */

define([
    'marionette',
    'templates',
    'underscore',
], function (Marionette, templates, _) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.wish,
        className: 'table-view-cell media',
        tagName: 'li',

        ui: {
            'remove': '.remove',
            'cart': '.add-to-cart'
        },

        events: {
            'click .add-to-cart': 'onClickCart',
            'click .remove': 'onClickRemove'
        },

        templateHelpers:function(){
            return {
                image: this.model.get('image'),
            }
        },

        onShow: function() {
            this.listenTo(app.events, 'editButtonClicked', this.onClickEdit);
            this.listenTo(app.events, 'doneButtonClicked', this.onClickDone);
        },

        onClickCart: function(e) {
            e.preventDefault();

            if (this.model.get('amount') <= window.app.user.get('bank')) {
                this.model.set('completed', true);

                this.model.save();

                var amount = window.app.user.get('bank');
                amount = amount - this.model.get('amount');
                window.app.user.set('bank', amount);

                this.close();
            }
        },

        onClickRemove: function(e) {
            e.preventDefault();
            this.model.destroy();
            this.close();
        },

        onClickEdit: function() {
            this.ui.remove.removeClass('display-none');
            this.ui.cart.addClass('display-none');
        },

        onClickDone: function() {
            this.ui.remove.addClass('display-none');
            this.ui.cart.removeClass('display-none');
        }
    });
});
