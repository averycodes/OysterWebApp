/*global define */

define([
    'marionette',
    'templates',
    'underscore',
    'views/WishView',
    'views/AddAmazonWish',
    'collections/WishCollection',
], function (Marionette, templates, _, WishView, AddAmazonWish, WishCollection) {
    'use strict';

    return Marionette.CompositeView.extend({
        template: templates.wishlist,
        itemView: WishView,
        itemViewContainer: '.wishlist-items',

        initialize: function() {
            this.regionManager = new Marionette.RegionManager();
            this.collection = new WishCollection();
            this.collection.fetch();
        },

        onDomRefresh: function() {
            this.addWishForm = this.regionManager.addRegion(
                "addWishForm", "#add-wish-form"
            );
            this.addWishForm.show(new AddAmazonWish({
                parent: this
            }));
        },

        onShow: function() {
            this.trigger('nav:wishlist');

        }

    });
});
