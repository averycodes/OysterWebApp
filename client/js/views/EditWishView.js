define([
  'marionette',
  'templates',
  'underscore',
  'models/Wish',
], function (Marionette, templates, _, Wish) {
  'use strict';

  return Marionette.ItemView.extend({
    template: templates.editwish,

    events: {
      'blur .title': 'onChangeTitle',
      'blur .amount': 'onChangeAmount',
      'blur .url': 'onChangeUrl',
      'blur .image': 'onChangeImage',
      'click .save-wish': 'onClickSaveWish'
    },

    initialize: function() {
      this.parent = this.options.parent;
    },

    templateHelpers: function() {
      return {
        isNew: true,
      };
    },

    onChangeTitle: function(e) {
      this.model.set('title', $(e.target).val());
    },

    onChangeAmount: function(e) {
      this.model.set('amount', $(e.target).val());
    },

    onChangeUrl: function(e) {
      this.model.set('url', $(e.target).val());
    },

    onChangeImage: function(e) {
      this.model.set('image_url', $(e.target).val());
    },

    onClickSaveWish: function(e) {
      this.model.save();

      this.model.on("change", function() {
        this.parent.fullCollection.add(this.model);
      }, this);
    }

  });
});