/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'views/WishView',
    'collections/WishCollection',
], function (Marionette, templates, _, WishView, WishCollection) {
    'use strict';

    return Marionette.CollectionView.extend({
        itemView: WishView,

        onShow: function() {
            this.trigger('nav:wishlist');
        },

        initialize: function() {
            this.collection = new WishCollection();
            this.collection.fetch();
        },

    });
});
