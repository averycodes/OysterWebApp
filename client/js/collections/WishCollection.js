/*global define */

define([
  'backbone',
  'models/Wish'
], function (Backbone, Wish) {
  'use strict';

  var WishCollection = Backbone.Collection.extend({
    model: Wish,
    url: "/api/v1/wishes/",

    unfeatured: function () {
      var filtered = this.filter(function (wish) {
        return wish.get("featured") === false;
      });
      return new WishCollection(filtered);
    }
  });

  return WishCollection;
});
