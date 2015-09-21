/*global define */

define([
  'marionette',
  'templates',
  'underscore',
], function (Marionette, templates, _) {
  'use strict';

  return Marionette.ItemView.extend({
    template: templates.history,
    className: 'history-item-view item',

    ui: {
      'undo': '.undo-button',
    },

    events: {
      'click .undo': 'onClickUndo',
      'mouseover': 'onHover',
      'mouseout': 'onStopHover'
    },

    onRender: function() {
      this.ui.undo.hide();
    },

    onClickUndo: function(e) {
      e.preventDefault();
      this.model.set('completed', false);
      this.model.save();

      var user = window.app.user,
        bank_amt = user.get("bank");

      if (this.model.get('is_credit')) {
        user.set("bank", bank_amt - this.model.get("amount"));
      } else {
        user.set("bank", bank_amt + this.model.get("amount"));
      }

      this.destroy();
    },

    onHover: function() {
      if(!window.mobile) {
        this.ui.undo.show();
      }
    },

    onStopHover: function() {
      if (!window.mobile) {
        this.ui.undo.hide();
      }
    }
  });
});
