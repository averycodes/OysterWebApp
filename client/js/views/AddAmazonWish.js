/*global define */

define([
  'marionette',
  'templates',
  'underscore',
  'models/Wish',
], function (Marionette, templates, _, Wish) {
  'use strict';

  return Marionette.ItemView.extend({
    template: templates.addamazonwish,
    className: "ui grid",

    events: {
      'blur .amazon-url': 'onChangeUrl',
      'click .save-wish': 'onClickSaveWish'
    },

    initialize: function(options) {
      this.parent = this.options.parent;
    },

    // onDomRefresh: function() {
    //   $(this.ui.input).focus();
    // },

    onChangeUrl: function(e) {
      this.model.set('amazon_link', $(e.target).val());
    },

    onClickSaveWish: function(e) {
      this.model.save();

      this.model.on("change", function() {
        this.parent.fullCollection.add(this.model);
      }, this);
    }
  });
});
