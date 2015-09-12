/*global define */

define([
  'marionette',
  'templates',
], function (Marionette, templates) {
  'use strict';

  return Marionette.ItemView.extend({
    template: templates.piggybank,

    templateHelpers: function() {
      var amount = this.model.get("bank");
      return {
        'amount': amount.toFixed(2)
      }
    },

    modelEvents: {
      "change": "onUserChanged"
    },

    onUserChanged: function() {
      this.render();
    }
  });
});
