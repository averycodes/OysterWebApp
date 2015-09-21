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
      'click .save-wish': 'onClickSaveWish',
      'keypress .amazon-url': 'onSubmitInput'
    },

    initialize: function(options) {
      this.parent = this.options.parent;
    },

    onChangeUrl: function(e) {
      this.model.set('amazon_link', $(e.target).val());
    },

    onClickSaveWish: function(e) {
      e.preventDefault();
      this.saveWish();
    },

    onSubmitInput: function(e) {
      if (e.which === 13) {
        this.model.set('amazon_link', $(e.target).val());
        this.saveWish();
      }
    },

    saveWish: function() {
      this.model.save();

      this.model.on("change", function() {
        this.parent.fullCollection.add(this.model);
      }, this);
    }
  });
});
