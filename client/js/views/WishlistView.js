/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'views/WishView',
], function (Marionette, templates, _, WishView) {
    'use strict';

    return Marionette.CompositeView.extend({
        template: templates.wishlist,
        childView: WishView,
        childViewContainer: '.wishlist-items',

    });
});
