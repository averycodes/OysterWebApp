/*global define */

define([
    'marionette',
    'templates',
    'underscore',
], function (Marionette, templates, _) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.wish,

        events: {
            'click button': 'onClickButton'
        },

        onClickButton: function(e) {
            e.preventDefault();

            if (this.model.get('cost') <= window.app.user.get('bank')) {
                this.model.set('purchased', true);

                this.model.save();

                var amount = window.app.user.get('bank');
                amount = amount - this.model.get('cost');
                window.app.user.set('bank', amount);

                this.close();
            }
        }
    });
});
