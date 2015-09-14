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

    ui: {
      input: '.new-wish'
    },

    events: {
      'click .other': 'onClickOther',
      'keypress .new-wish': 'onSubmitInput'
    },

    initialize: function(options) {
      this.parent = this.options.parent;
    },

    onDomRefresh: function() {
      $(this.ui.input).focus();
    },

    onSubmitInput: function(e) {
      if (e.which === 13) {
        var $input = $(this.ui.input),
          wish = new Wish({
            amazon_link: $input.val()
          }),
          promise = wish.save();

        wish.on("change", function() {
          this.parent.collection.add(wish);
        }, this);
      }
    },

    onClickOther: function(e) {
      e.preventDefault();
    }
  });
});
