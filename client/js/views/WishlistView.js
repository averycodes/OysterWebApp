/*global define */

define([
  'marionette',
  'templates',
  'underscore',
  'views/WishView',
  'views/AddAmazonWish',
  'views/EditWishView',
  'models/Wish',
], function (Marionette, templates, _, WishView, AddAmazonWish, EditWishView, Wish) {
  'use strict';

  return Marionette.CompositeView.extend({
    template: templates.wishlist,
    childView: WishView,
    childViewContainer: '.wishlist-items',
    viewComparator: "amount",

    templateHelpers: function() {
      return {
        showFeaturedCard: !!this.model
      }
    },

    ui: {
      'advancedoptions': '.advanced-options',
      'cancel': '.cancel'
    },

    events: {
      'click .advanced-options': 'onClickAdvancedOptions',
      'click .cancel': 'onClickCancel'
    },

    initialize: function() {
      this.regionManager = new Marionette.RegionManager();

      this.fullCollection = this.collection;
      this.listenTo(this.fullCollection, "change:featured", this.setFeatured);
      this.listenTo(this.fullCollection, 'add', this.onAddWish);

      this.model = this.fullCollection.find(function(wish) {
        return wish.get('featured') === true;
      });

      this.collection = this.fullCollection.unfeatured();
    },

    onDomRefresh: function() {
      this.wishContainer = this.regionManager.addRegion(
        "wishContainer", ".add-wish-container"
      );
      this.featuredWish = this.regionManager.addRegion(
        "featuredWish", ".featured-wish"
      );
      this.wishContainer.show(new AddAmazonWish({
        parent: this,
        model: new Wish()
      }));
      this.ui.cancel.hide();

      if (this.model) {
        this.featuredWish.show(new WishView({
          model: this.model
        }));
      }
    },

    onClose: function() {
      this.regionManager.close();
    },

    // Only feature one item at a time, if something
    // in the collection is featured, unset the others
    setFeatured: function(model, value) {
      if (value) {
        _.each(this.fullCollection.reject({id:model.id}), function(wish) {
          if (wish.get('featured')) {
            wish.set('featured', false, {silent:true});
            wish.save();
          }
        });
        this.model = model;
      } else {
        this.model = null;
      }
      this.collection = this.fullCollection.unfeatured();
      this.render();
    },

    onClickCancel: function(e) {
      e.preventDefault();

      this.wishContainer.show(new AddAmazonWish({
        parent: this,
        model: new Wish()
      }));
      this.ui.advancedoptions.show();
      this.ui.cancel.hide();
    },

    onClickAdvancedOptions: function(e) {
      e.preventDefault();

      this.wishContainer.show(new EditWishView({
        parent: this,
        model: new Wish()
      }));
      this.ui.advancedoptions.hide();
      this.ui.cancel.show();
    },

    onAddWish: function() {
      this.collection = this.fullCollection.unfeatured();
      this.render();
    }
  });
});
