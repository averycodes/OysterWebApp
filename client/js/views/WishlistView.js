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
      'addWishes': '.add-wishes'
    },

    events: {
      'click .add-wish': 'onClickAddWish',
      'click .add-amazon-wish': 'onClickAddAmazonWish'
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
            wish.set('featured', false);
            wish.save();
          }
        });
        this.collection = this.fullCollection.unfeatured();
        this.model = model;
        this.render();
      }
    },

    onClickAddAmazonWish: function(e) {
      e.preventDefault();

      this.wishContainer.show(new AddAmazonWish({
        parent: this,
        model: new Wish()
      }));
      this.ui.addWishes.hide();
    },

    onClickAddWish: function(e) {
      e.preventDefault();

      this.wishContainer.show(new EditWishView({
        parent: this,
        model: new Wish()
      }));
      this.ui.addWishes.hide();
    },

    onAddWish: function() {
      this.collection = this.fullCollection.unfeatured();
      this.render();
    }
  });
});
