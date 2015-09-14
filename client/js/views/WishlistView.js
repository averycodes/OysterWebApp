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
    viewComparator: "amount",

    templateHelpers: function() {
      return {
        showFeaturedCard: !!this.model
      }
    },

    initialize: function() {
      this.listenTo(this.collection, "change:featured", this.setFeatured);
      this.fullCollection = this.collection;

      this.model = this.fullCollection.find(function(wish) {
        return wish.get('featured') === true;
      });

      this.collection = this.fullCollection.unfeatured();
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
    }
  });
});
