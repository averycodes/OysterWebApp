/*global define */

define([
  'marionette',
  'templates',
  'underscore',
], function (Marionette, templates, _) {
  'use strict';

  return Marionette.ItemView.extend({
    template: templates.wish,
    className: 'ui centered card',
    tagName: 'div',

    ui: {
      'remove': '.remove',
    },

    events: {
      'click .buy': 'onClickBuy',
      'click .remove': 'onClickRemove',
      'click .feature': 'onClickFeature'
    },

    templateHelpers:function() {
      var link_url;
      if (this.model.get('amazon_url')) {
        link_url = this.model.get('amazon_url');
      } else {
        link_url = this.model.get('url');
      }
      return {
        link_url: link_url,

      }
    },

    onShow: function() {
      this.listenTo(app.events, 'editButtonClicked', this.onClickEdit);
      this.listenTo(app.events, 'doneButtonClicked', this.onClickDone);
    },

    onClickBuy: function(e) {
      e.preventDefault();

      if (this.model.get('amount') <= window.app.user.get('bank')) {
        this.model.set('completed', true);

        this.model.save();

        var amount = window.app.user.get('bank');
        amount = amount - this.model.get('amount');
        window.app.user.set('bank', amount);

        this.destroy();
      }

      // TODO: open the buy link
    },

    onClickRemove: function(e) {
      e.preventDefault();
      this.model.destroy();
      this.destroy();
    },

    onClickFeature: function(e) {
      e.preventDefault();
      this.model.set('featured', true);
      this.model.save();
    },

    // TODO: deprecated
    onClickEdit: function() {
      this.ui.remove.removeClass('display-none');
      this.ui.cart.addClass('display-none');
    },

    onClickDone: function() {
      this.ui.remove.addClass('display-none');
      this.ui.cart.removeClass('display-none');
    },


  });
});
